let searchBtn = $('#search-form');
searchBtn.submit(searchEngine);

let celBtn = $('#temp-c');
let farBtn = $('#temp-f');

celBtn.click(displayCelsius);
farBtn.click(displayinImperial);

let celsiusTemp = null;

function searchEngine(event){
    event.preventDefault();

    function formatDate(timestamp){

        let cityTime = new Date(timestamp);
        let date = cityTime.getDate();

        let week = [
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

        let day = week[cityTime.getDay()];
        let month = months[cityTime.getMonth()];

        return `${day} ${date} ${month} ${formatHours(timestamp)}`;
    }

    function formatHours(timestamp){
        let forcastTime = new Date(timestamp);

        let hours = forcastTime.getHours();
        let mins = forcastTime.getMinutes();

        if(hours < 10){
            hours = `0${hours}`;
        }
        if(mins < 10){
            mins = `0${mins}`;
        }

        return `${hours}:${mins}`;
    }

    function showInfo(response){
        let cityName = response.data.name;
        let countryName = response.data.sys.country;
        celsiusTemp = Math.round(response.data.main.temp);
        let description = response.data.weather[0].description;
        let humidity = response.data.main.humidity;
        let speed = Math.round(response.data.wind.speed);
        let icon = response.data.weather[0].icon;
        let dayTime = response.data.dt*1000;

        let cityDisplay = $('#city-name');
        cityDisplay.html(`${cityName},${countryName}`);

        let tempDisplay = $('#temp');
        tempDisplay.html(`${celsiusTemp}`);

        let descriptionDisplay = $('#description');
        descriptionDisplay.html(`${description}`);

        let humidityDisplay = $('#humidity');
        humidityDisplay.html(`Humidity: ${humidity}`);

        let speedDisplay = $('#speed');
        speedDisplay.html(`Speed: ${speed}Km/h`);

        let timeDisplay = $('#current-time');
        timeDisplay.html(formatDate(dayTime));

        let iconDisplay = $('#icon');
        iconDisplay.attr("src",`images/${icon}.png`);
    }

    function showForecast(response) {
        let forecastDisplay = document.querySelector("#forecast-display");
        let forecast = null;
        forecastDisplay.innerHTML = null;

        for (let index = 0; index < 6; index++) {
            forecast = response.data.list[index];
            forecastDisplay.innerHTML += `
        <div class="col-sm-2 text-center date-large mb-5">
                <h3 class="date-large">
                ${formatHours(forecast.dt * 1000)}
            </h3>
            <img src="images/${forecast.weather[0].icon}.png" alt="forecast icon" class="img-fluid forecast-icon">
            <div class="forecast-temperatures">
                <strong>
                         ${Math.round(forecast.main.temp_max)}°
                 </strong> 
                  ${Math.round(forecast.main.temp_min)}°
            </div>
        </div>`;

        }
    }
    // -------------------------------------------------------------------- API's-------------------------
    let cityInput = $("#search-city");

    // console.log(cityInput);
    let city = `${cityInput.val()}`;
    // console.log(city);
    let apiKey = "0603e85b4ce086e6bb52d7cdc7bcffb5";
    let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather?q=";
    let units = "metric";

    let url = `${apiEndPoint}${city}&units=${units}&appid=${apiKey}`;
    let forecasturl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=0603e85b4ce086e6bb52d7cdc7bcffb5`;

    // $.get(url,showInfo);
    // $.get(forecasturl,showForecast);
    axios.get(url).then(showInfo); //this is the axios command that uses the city and the rest of the API call elements to make the call.

    axios.get(forecasturl).then(showForecast);
}


function displayinImperial(event){
    event.preventDefault();
    farBtn.addClass("active");
    celBtn.removeClass("active");

    let fahrTemp = Math.round((celsiusTemp*9/5)+32);
    let tempDisplay = $("#temp");
    tempDisplay.html(`${fahrTemp}°F`);
}

function displayCelsius(event){
    event.preventDefault();
    farBtn.removeClass("active");
    celBtn.addClass("active");

    let tempDisplay = $("#temp");
    tempDisplay.html(`${celsiusTemp}°C`);
}
