const CityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-button");
const locationButton = document.querySelector(".location-button");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "462e136c80f86f408500f7c40214b681";
const createWeatherCard = (CityName, weatherItem, index) => {
	if(index == 0){
		return `<div class="details">
		            <h2>${CityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
		            <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
	                <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
	                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
					
	              </div>
	              <div class="icon">
				  <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
				    
		            <h4>${weatherItem.weather[0].description}</h4>
	              </div>`;

	} else {
		return `<li class="card">
	              <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
				  <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
	             
	              <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
	              <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
	              <h4>Humidity: ${weatherItem.main.humidity}%</h4> 
                </li>`;

	}
	
}
const getWeatherDetails = (CityName, lat, lon) => {
	const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

	fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
		const uniqueForecastDays = [];
		const sevenDaysForecast = data.list.filter(forecast => {
			const forecastDate = new Date(forecast.dt_txt).getDate();
			if(!uniqueForecastDays.includes(forecastDate)){
				return uniqueForecastDays.push(forecastDate);
			}
		});
// clearing previous data//
		CityInput.value = "";
		currentWeatherDiv.innerHTML = "";
		weatherCardsDiv.innerHTML = "";

		// console.log(sevenDaysForecast);
		sevenDaysForecast.forEach((weatherItem, index) => {
			if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(CityName, weatherItem, index));
			}
			else{
				weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(CityName, weatherItem, index));
			}
			
		
		});

	}).catch(() => {
		alert("An error occured while fetching the weather forecast!");

	});
}

const getCityCoordinates = () => {
	const CityName = CityInput.value.trim();
	if(!CityName) return;
	const GEOCODING_API_URL =`http://api.openweathermap.org/geo/1.0/direct?q=${CityName}&limit=1&appid=${API_KEY}`;
	// console.log(CityName)
	fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
		if(!data.length)return alert(`no coordinates found for ${CityName}`);
		const { name, lat, lon} = data[0];
		getWeatherDetails(name, lat, lon);
	}).catch(() =>{
		alert("An error occured while fetching the coordinates!");

	});
}
const getUserCoordinates = () => {
	navigator.geolocation.getCurrentPosition(
		position => {
           const {latitude, longitude} = position.coords;
		   const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
		   fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
			const { name } = data[0];
			getWeatherDetails(name, latitude, longitude );
			
		}).catch(() =>{
			alert("An error occured while fetching the city!");
	
		});
		},
		error => {
			if( error.code === error.PERMISSION_DENIED){
				alert("Geolocation request denied. Please reset location permission to grant access again.")
			}
		}
	);
}
searchButton.addEventListener("click",getCityCoordinates);
locationButton.addEventListener("click",getUserCoordinates);
CityInput.addEventListener("keyup", e => e.key === "enter" &&  getCityCoordinates());





