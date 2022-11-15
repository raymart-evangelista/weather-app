import { data } from "autoprefixer";
import "./style.css";

class View {
  constructor() {
    this.app = document.getElementById('app')
    this.app.classList = 'w-screen h-screen flex justify-center dark:bg-gray-900'
    
    this.weatherCard = document.createElement('div')
    this.weatherCard.classList = 'w-60 h-96 flex flex-col p-2 mt-4 w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 gap-4'

    let textStyle = 'text-center block mb-1 text-sm font-medium text-gray-900 dark:text-gray-100'

    this.zipInputLabel = document.createElement('label')
    this.zipInputLabel.classList = textStyle
    this.zipInputLabel.textContent = 'Enter a zip code'


    this.zipInput = document.createElement('input')
    this.zipInput.classList = 'w-fit bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
    this.zipInput.type = 'text'
    this.zipInput.placeholder = 'e.g.: 94108'
    
    this.zipInputButton = document.createElement('button')
    this.zipInputButton.classList = 'w-fit text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
    this.zipInputButton.textContent = 'Submit'

    this.zipInputContainer = document.createElement('div')
    this.zipInputContainer.classList = 'flex flex-col gap-2 place-items-center'
    this.zipInputContainer.append(this.zipInputLabel, this.zipInput, this.zipInputButton)
    

    this.errElem = document.createElement('h1')
    this.errElem.classList = textStyle
    this.tempElem = document.createElement('h1')
    this.tempElem.classList = textStyle
    this.cityName = document.createElement('h1')
    this.cityName.classList = textStyle
    this.zipCode = document.createElement('h1')
    this.zipCode.classList = textStyle

    this.resultsContainer = document.createElement('div')
    this.resultsContainer.classList = 'mt-2 flex flex-col gap-2 place-items-center'

    this.resultsContainer.append(
      this.zipInputContainer,
      this.errElem,
      this.cityName, 
      this.zipCode, 
      this.tempElem,
      )

    this.weatherCard.append(this.resultsContainer)
    
    this.app.append(this.weatherCard)


    this.weatherDesc = document.createElement('h1')
    this.weatherDesc.classList = textStyle
    this.weatherIcon = document.createElement('img')

    this.weatherDescContainer = document.createElement('div')
    this.weatherDescContainer.classList = 'flex justify-center content-center place-items-center'
    this.weatherDescContainer.append(this.weatherDesc, this.weatherIcon)

    this.weatherCard.append(
      this.weatherDescContainer
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
      
      this.tempElem.textContent = `${tempValue}°F`
      this.errElem.textContent = ''
      this.weatherDesc.textContent = `${weatherDesc}`
      this.weatherIcon.src = iconUrl
      this.weatherIcon.width = '64'
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