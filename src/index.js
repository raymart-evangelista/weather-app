import { data } from "autoprefixer";
import "./style.css";

class View {
  constructor() {
    console.log("hello world!");

    this.app = document.getElementById('app')
    
    this.zipInput = document.createElement('input')
    this.zipInput.type = 'text'
    this.zipInput.placeholder = 'e.g.: 94108'
    
    this.zipInputButton = document.createElement('button')
    this.zipInputButton.textContent = 'Submit'
    
    this.tempElem = document.createElement('h1')

    this.app.append(this.zipInput, this.zipInputButton, this.tempElem)

    
    this.zipInputButton.addEventListener('click', event => {
      event.preventDefault()
    
      this.getWeatherData(this.zipInput.value).then(result => {
        this.displayWeather(result)
      })
    })
  }

  async getWeatherData(zip) {
    try {
      const data = await this.getZipInfo(zip)
      console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&appid=b43956d89a79c4536461499aee6eb38b&units=imperial`)
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&appid=b43956d89a79c4536461499aee6eb38b&units=imperial`, {mode: 'cors'})
      const weatherData = await response.json()
      console.log(`${weatherData.main.temp} degrees fahrenheit`)
      return weatherData
    } catch (err) {
      alert(err)
    }
  }

  async getZipInfo(zip) {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/zip?zip=${zip},US&appid=b43956d89a79c4536461499aee6eb38b&units=imperial`, {mode: 'cors'})
    const apiData = await response.json()
    return apiData
  }

  async displayWeather(data) {
    // console.log(data.main.temp)
    let tempValue = await data.main.temp
    console.log(tempValue)
    this.tempElem.textContent = tempValue
  }

  
  
}

class Controller {
  constructor(view) {
    this.view = view
  }
}

const app = new Controller(new View())