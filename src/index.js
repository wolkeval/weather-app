// Sets initial temperature unit to Celsius
let celsiusFlag = true;

let apiKey = "e04e51dd1592166f33d5c79d198d4731";
let units = "metric";

// Receives the API response either from retrieveByCoordinates or retrieveByCity and displays the weather
function showWeather(response) {
  let currentTemp = document.querySelector("#current-degrees");
  let currentCity = document.querySelector("#current-city");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  let description = document.querySelector(".description");
  currentTemp.innerHTML = Math.round(response.data.main.temp);
  currentCity.innerHTML = response.data.name;
  humidity.innerHTML = `${response.data.main.humidity}%`;
  wind.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;
  description.innerHTML = response.data.weather[0].description;
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

// =======================================================================

// DATE HANDLER ==========================================================
function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
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
    "December"
  ];

  return `${days[now.getDay()]}, ${now.getDate()} ${
    months[now.getMonth()]
  } ${now.getFullYear()}`;
}

let now = new Date();
let currentDate = document.querySelector("#date");
currentDate.innerHTML = formatDate(now);
// =======================================================================

// TIME ==================================================================
let currentTime = document.querySelector("#time");

// Displays single-digit numbers with leading zero
function leadingZero(value) {
  if (value < 10) {
    return (value = `0${value}`);
  } else {
    return value;
  }
}

let currentHour = now.getHours();
let currentMinutes = now.getMinutes();
currentTime.innerHTML = `${leadingZero(currentHour)}:${leadingZero(
  currentMinutes
)}`;

// ALTERNATIVE METHOD
// Displays single-digit hours with leading zero
// let currentHour = now.getHours().toString();
// if (currentHour.length === 1) {
//   currentHour = `0${currentHour}`;
// }

// // Displays single-digit minutes with leading zero
// let currentMinutes = now.getMinutes().toString();
// if (currentMinutes.length === 1) {
//   currentMinutes = `0${currentMinutes}`;
// }

// currentTime.innerHTML = `${currentHour}:${currentMinutes}`;
// =======================================================================

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
