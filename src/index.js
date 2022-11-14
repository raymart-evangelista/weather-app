import { data } from "autoprefixer";
import "./style.css";
console.log("hello world!");

let app = document.getElementById('app')


let zipInput = document.createElement('input')
zipInput.type = 'text'
zipInput.placeholder = 'e.g.: 94108'

let zipInputButton = document.createElement('button')
zipInputButton.textContent = 'Submit'

app.append(zipInput, zipInputButton)

zipInputButton.addEventListener('click', event => {
  event.preventDefault()

  getWeather(zipInput.value).then(result => {
    // console.log(result)
  })
})

async function getWeather(zip) {
  try {
    const data = await getZipInfo(zip)
    console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&appid=b43956d89a79c4536461499aee6eb38b&units=imperial`)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&appid=b43956d89a79c4536461499aee6eb38b&units=imperial`, {mode: 'cors'})
    const weatherData = await response.json()
    console.log(`${weatherData.main.temp} degrees fahrenheit`)
    displayWeather(weatherData)
  } catch (err) {
    alert(err)
  }
}

async function getZipInfo(zip) {
  const response = await fetch(`https://api.openweathermap.org/geo/1.0/zip?zip=${zip},US&appid=b43956d89a79c4536461499aee6eb38b&units=imperial`, {mode: 'cors'})
  const apiData = await response.json()
  return apiData
}

async function displayWeather(data) {
  // console.log(data.main.temp)
  let tempValue = await data.main.temp
  console.log(tempValue)
  let tempElem = document.createElement('h1')
  tempElem.textContent = tempValue
  app.append(tempElem)
}