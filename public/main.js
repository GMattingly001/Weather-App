// Author: George Mattingly
// DateCreation: 08/19/25
// AppName: Weather
// Description: Use's OpenWeatherMap's api to retrieve current weather
// conditions based on the city that the user enters.

// Class for destructuring coordinates from API
class CityCoordinates {
  constructor([{ lat, lon }]) {
    this.lat = lat;
    this.lon = lon;
  }
}

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "API_KEY";

// Listens for when the submit button is clicked
weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value;

  if (city) {
    try {
      const cityCoords = await getCityCoordinates(city);
      const weatherData = await getWeatherData(cityCoords);
      displayWeatherInfo(weatherData, city);
    } catch (error) {
      console.error(error);
      displayError(error);
    }
  } else {
    displayError("Please enter a city!");
  }
});

// Fetches the current weather for the given coordinates
async function getWeatherData(coords) {
  const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Could not fetch weather data");
  }
  const data = await response.json();
  if (data.length === 0) {
    throw new Error("Invalid city name");
  }
  return data;
}

// Converts the city to coordinates that can then be used for openWeathermap's API
async function getCityCoordinates(city) {
  const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Could not fetch weather data");
  }
  const data = await response.json();
  if (data.length === 0) {
    throw new Error("Invalid city name");
  }
  const coords = new CityCoordinates(data);
  return coords;
}

// Displays the weather on the card
function displayWeatherInfo(data, city) {
  console.log(data);

  const {
    current: {
      humidity,
      temp,
      weather: [{ id, description } = {}],
    },
  } = data;

  card.textContent = "";
  card.style.display = "flex";

  const cityName = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descDisplay = document.createElement("p");
  const weatherEmoji = document.createElement("p");

  // Reformat and add city data
  city = reformatCityName(city);
  cityName.classList.add("cityDisplay");
  cityName.textContent = city;

  // Add current tempurature data
  tempDisplay.classList.add("tempDisplay");
  tempDisplay.textContent = ((temp - 272.15) * (9 / 5) + 32).toFixed(1) + "˚F";

  // Add humidity data
  humidityDisplay.classList.add("humidityDisplay");
  humidityDisplay.textContent = humidity + "% humidity";

  // Add description data
  descDisplay.classList.add("descDisplay");
  descDisplay.textContent = description;

  // Add weatherEmoji data
  weatherEmoji.classList.add("weatherEmoji");
  weatherEmoji.textContent = getWeatherEmoji(id);

  card.appendChild(cityName);
  card.appendChild(tempDisplay);
  card.appendChild(humidityDisplay);
  card.appendChild(descDisplay);
  card.appendChild(weatherEmoji);
}

// Reformats the city name for the card's style
function reformatCityName(cityName) {
  const firstLetter = cityName.charAt(0);
  const firstLetterCap = firstLetter.toUpperCase();
  const remainingLetters = cityName.slice(1).toLowerCase();
  cityName = firstLetterCap + remainingLetters;
  return cityName;
}

// Returns the weather emoji based on the weather id
function getWeatherEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "⛈️";
    case weatherId >= 300 && weatherId < 600:
      return "🌧️";
    case weatherId >= 600 && weatherId < 700:
      return "🌨️";
    case weatherId > 700 && weatherId < 800:
      return "🌫️";
    case weatherId === 800:
      return "☀️";
    case weatherId > 800:
      return "⛅️";
  }
}

// Displays an error on the card if anything goes wrong.
function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}
