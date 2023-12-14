async function fetchCityAndWeather() {
    try {
        const { lat, lon } = await fetchCity();
        await fetchWeather(lat, lon);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchCity() {
    const cityApiKey = 'YOUR_API_KEY_HERE';
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async position => {
                const { latitude, longitude } = position.coords;

                const reverseGeocodeApiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${cityApiKey}`;

                try {
                    const reverseGeocodeResponse = await fetch(reverseGeocodeApiUrl);
                    const reverseGeocodeData = await reverseGeocodeResponse.json();
                    const cityName = reverseGeocodeData.results[0].components.city;

                    document.getElementById('city').textContent = cityName;
                    resolve({ lat: latitude, lon: longitude });
                } catch (error) {
                    reject(error);
                }
            }, error => reject(error));
        } else {
            reject('Geolocation is not supported by your browser');
        }
    });
}

async function fetchWeather(lat, lon) {
    const weatherApiKey = 'YOUR_API_KEY_HERE';
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`;

    try {
        const weatherResponse = await fetch(weatherApiUrl);
        const weatherData = await weatherResponse.json();
        const weatherInCelcius = (weatherData.main.temp - 273.15).toFixed(2);

        document.getElementById('temperature').textContent = `${weatherInCelcius}°C`;
        document.getElementById('condition').textContent = weatherData.weather[0].description;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}