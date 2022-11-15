import { data } from "autoprefixer";
import "./style.css";

class View {
  constructor() {
    this.app = document.getElementById('app')
    
    this.zipInput = document.createElement('input')
    this.zipInput.type = 'text'
    this.zipInput.placeholder = 'e.g.: 94108'
    
    this.zipInputButton = document.createElement('button')
    this.zipInputButton.textContent = 'Submit'
    
    this.errElem = document.createElement('h1')
    this.tempElem = document.createElement('h1')
    this.cityName = document.createElement('h1')
    this.zipCode = document.createElement('h1')

    this.app.append(
      this.zipInput,
      this.zipInputButton, 
      this.errElem,
      this.cityName, 
      this.zipCode, 
      this.tempElem,
      )

    this.weatherDesc = document.createElement('h1')
    this.weatherIcon = document.createElement('img')

    this.app.append(
      this.weatherDesc,
      this.weatherIcon
    )
    
    this.zipInputButton.addEventListener('click', event => {
      event.preventDefault()
      this.clearDOM()
    
      this.getWeatherData(this.zipInput.value)
      .then(result => {
        this.displayWeather(result)
      })
    })
  }

  clearDOM() {
    this.cityName.textContent = ''
    this.zipCode.textContent = ''
    this.weatherDesc.textContent = ''
    this.weatherIcon.src = ''
  }

  async getWeatherData(zip) {
    try {
      const data = await this.getZipInfo(zip)
      console.log(`[getWeatherData][data]: ${data}`)
      if (data) {
        const weatherData = await this.loadJson(`https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&appid=b43956d89a79c4536461499aee6eb38b&units=imperial`)
        this.cityName.textContent = data.name
        this.zipCode.textContent = data.zip
        return weatherData
        // console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&appid=b43956d89a79c4536461499aee6eb38b&units=imperial`)
        // console.log(`${weatherData.main.temp} degrees fahrenheit`)
      } else {
        console.log("couldn't find that zip")
      }
    } catch (err) {
      console.log('something went wrong')
    } finally {
      this.zipInput.value = ''
    }
  }

  async getZipInfo(zip) {
    const data = await this.loadJson(`https://api.openweathermap.org/geo/1.0/zip?zip=${zip},US&appid=b43956d89a79c4536461499aee6eb38b&units=imperial`)
    return data
  }

  async displayWeather(data) {
    // console.log(data.main.temp)
    if (data) {
      let tempValue = parseInt(data.main.temp)
      let weatherDesc = data.weather[0].description
      let weatherIconCode = data.weather[0].icon
      let iconUrl = `http://openweathermap.org/img/wn/${weatherIconCode}@2x.png`
      
      this.tempElem.textContent = `${tempValue} degrees fahrenheit`
      this.errElem.textContent = ''
      this.weatherDesc.textContent = `${weatherDesc}`
      this.weatherIcon.src = iconUrl
    } else {
      this.errElem.textContent = 'invalid zip code'
      this.tempElem.textContent = ''
    }
    // console.log(tempValue)
  }

  async loadJson(url) {
    try {
      let response = await fetch(url, {mode: 'cors'})
      if (response.status == 200) {
        return response.json()
      }
    } catch (err) {
      console.log(`something went wrong: ${err}`)
    }
  }

  
  
}

class Controller {
  constructor(view) {
    this.view = view
  }
}

const app = new Controller(new View())