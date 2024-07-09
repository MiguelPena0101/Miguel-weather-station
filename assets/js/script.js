// scripts.js
const apiKey = 'a6442682e2dc18db064a0c9a3e8e85e9';
const form = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
        cityInput.value = '';
    }
});

function fetchWeather(city) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) throw new Error('City not found');
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(data);
            addToSearchHistory(city);
        })
        .catch(error => alert(error.message));

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => alert(error.message));
}

function displayCurrentWeather(data) {
    const { name, main: { temp, humidity }, wind: { speed }, weather } = data;
    currentWeather.innerHTML = `
        <h2>${name}</h2>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <img src="http://openweathermap.org/img/wn/${weather[0].icon}.png" class="weather-icon" alt="weather icon">
        <p>Temperature: ${temp}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${speed} m/s</p>
    `;
}

function displayForecast(data) {
    forecast.innerHTML = '<h2>5-Day Forecast:</h2>';
    const forecastList = data.list.filter((item, index) => index % 8 === 0);
    forecastList.forEach(item => {
        const { dt_txt, main: { temp, humidity }, wind: { speed }, weather } = item;
        forecast.innerHTML += `
            <div>
                <div>${new Date(dt_txt).toLocaleDateString()}</div>
                <img src="http://openweathermap.org/img/wn/${weather[0].icon}.png" class="weather-icon" alt="weather icon">
                <div>Temp: ${temp}°C</div>
                <div>Humidity: ${humidity}%</div>
                <div>Wind: ${speed} m/s</div>
            </div>
        `;
    });
}

function addToSearchHistory(city) {
    const cityElement = document.createElement('p');
    cityElement.textContent = city;
    cityElement.addEventListener('click', () => fetchWeather(city));
    searchHistory.appendChild(cityElement);
}
