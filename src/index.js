// Sets initial temperature unit to Celsius
let celsiusFlag = true;

let apiKey = "e04e51dd1592166f33d5c79d198d4731";
let units = "metric";

// DATE & TIME HANDLER // =====================================================

// Given target offset wrt UTC (in sec), returns target timestamp (in ms),
// where target is a specific city
function getTargetTimestamp(targetOffsetInSec) {
  let now = new Date();
  // now.getTimezoneOffset() returns local offset wrt UTC in minutes as UTC time - your local time
  let localOffsetInMs = now.getTimezoneOffset() * 60 * 1000;
  let targetOffsetInMs = targetOffsetInSec * 1000;
  let targetTimestamp = now.getTime() + localOffsetInMs + targetOffsetInMs;
  return targetTimestamp;
}

function formatDate(timestamp) {
  let now = new Date(timestamp);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let weekday = days[now.getDay()];
  let day = now.getDate();
  let month = months[now.getMonth()];
  let year = now.getFullYear();
  let fullDate = `${weekday}, ${day} ${month} ${year}`;
  return fullDate;
}

// Displays single-digit numbers with leading zero
function leadingZero(value) {
  if (value < 10) {
    return (value = `0${value}`);
  } else {
    return value;
  }
}

function formatTime(timestamp) {
  let now = new Date(timestamp);
  console.log(now);
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let time = `${leadingZero(hours)}:${leadingZero(minutes)}`;
  return time;
}

// =======================================================================

// Receives the API response either from retrieveByCoordinates or retrieveByCity and displays the weather
function showWeather(response) {
  let temperatureElement = document.querySelector("#current-degrees");
  let cityElement = document.querySelector("#current-city");
  let dateElement = document.querySelector("#current-date");
  let timeElement = document.querySelector("#current-time");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let descriptionElement = document.querySelector("#description");
  let iconElement = document.querySelector("#current-icon");

  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name;
  humidityElement.innerHTML = `${response.data.main.humidity}%`;
  windElement.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;
  descriptionElement.innerHTML = response.data.weather[0].description;
  let timestamp = getTargetTimestamp(response.data.timezone);
  dateElement.innerHTML = formatDate(timestamp);
  timeElement.innerHTML = formatTime(timestamp);
}

function retrieveByCoordinates(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeather);
}

// Receives a city either on load (Tokyo) or from handleForm, makes an API call and calls showWeather
function retrieveByCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  console.log(apiUrl);
  axios.get(apiUrl).then(showWeather);
}

// Displays the weather for Tokyo on load
retrieveByCity("Tokyo");

function handleForm(city) {
  city.preventDefault();
  let cityInput = document.querySelector("#city-input");
  retrieveByCity(cityInput.value);
}

let form = document.querySelector("form");
form.addEventListener("submit", handleForm);

// SWITCH BUTTON // ======================================================
function toFahrenheit(celsius) {
  let fahrenheit = Math.round(celsius * (9 / 5) + 32);
  return fahrenheit;
}

function toCelsius(fahrenheit) {
  let celsius = Math.round((fahrenheit - 32) / (9 / 5));
  return celsius;
}

function changeTempUnit() {
  let currentDegrees = document.querySelector("#current-degrees");
  // Switches between Celsius and Fahrenheit
  if (celsiusFlag) {
    currentDegrees.innerHTML = toFahrenheit(currentDegrees.innerHTML);
    celsiusFlag = false;
  } else {
    currentDegrees.innerHTML = toCelsius(currentDegrees.innerHTML);
    celsiusFlag = true;
  }
}

let switchButton = document.querySelector("#switch");
switchButton.addEventListener("click", changeTempUnit);
// =======================================================================

// LOCATE USER ===========================================================

// Locates user when locationButton is clicked
function locateUser() {
  navigator.geolocation.getCurrentPosition(retrieveByCoordinates);
}

let locationButton = document.querySelector("#location");
locationButton.addEventListener("click", locateUser);
