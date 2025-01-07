async function fetchWeather() {
    const location = document.getElementById('location').value;
    const apiKey = '00cf3fb004d7775791b0c9e5bf3a1a84'; // Replace with your OpenWeatherMap API key
    const weatherApp = document.getElementById('weather-app');

    weatherApp.classList.add('fetching');

    if (location) {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        if (data.cod === 200) {
            displayWeather(data, location);
        } else {
            alert('City not found!');
        }
    } else {
        alert('Please enter a city name');
    }
}

async function fetchWeatherByCoordinates(lat, lon) {
    const apiKey = '00cf3fb004d7775791b0c9e5bf3a1a84'; // Replace with your OpenWeatherMap API key
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    if (data.cod === 200) {
        const locationName = data.name; // Extract the city name from the API response
        displayWeather(data, locationName);
    } else {
        alert('Unable to fetch weather for your location.');
    }
}

function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherByCoordinates(lat, lon);
            },
            (error) => {
                alert('Geolocation failed. Please enter a city manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

function displayWeather(data, locationName) {
    const temperature = document.getElementById('temperature');
    const cloudCover = document.getElementById('cloud-cover');
    const precipitation = document.getElementById('precipitation');
    const sunriseSunset = document.getElementById('sunrise-sunset');
    const airQuality = document.getElementById('air-quality');
    const weatherIcon = document.getElementById('weather-icon');

    const temp = data.main.temp;
    const clouds = data.clouds.all;
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

    // Determine the emoji for temperature
    let tempEmoji = '';
    let iconSrc = '';

    if (temp > 30) {
        tempEmoji = '🔥';
        iconSrc = 'images/hot.jfif';
    } else if (temp > 20) {
        tempEmoji = '☀️';
        iconSrc = 'images/warm.jfif';
    } else if (temp > 10) {
        tempEmoji = '⛅';
        iconSrc = 'images/mild.jfif';
    } else if (temp > 0) {
        tempEmoji = '❄️';
        iconSrc = 'images/cold.png';
    } else {
        tempEmoji = '🥶';
        iconSrc = 'images/freeze.jpg';
    }

    // Set content with emoji and update the weather icon
    temperature.innerHTML = `Temperature: ${temp}°C ${tempEmoji}`;
    cloudCover.textContent = `Cloud Cover: ${clouds}%`;
    precipitation.textContent = `Precipitation: ${data.weather[0].description}`;
    sunriseSunset.textContent = `Sunrise: ${sunrise}, Sunset: ${sunset}`;
    airQuality.textContent = 'Air Quality: Moderate';
    weatherIcon.src = iconSrc;

    // Display the location name
    document.getElementById('location').value = locationName;
}
