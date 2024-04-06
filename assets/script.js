$(document).ready(function () {
    var apiKEY = 'be612f0c44bf28567955425fac4ce087'
    var cityContainer = $('#city-container')
    var searchInput = $('.search-input')
    var searchButton = $('.search-button')
    window.onload = function () {
        loadSavedCities()
    }

    function loadSavedCities() {
        cityContainer.empty()
        var savedCities = JSON.parse(localStorage.getItem("savedCities")) || []
        for (var i = 0; i < savedCities.length; i++) {
            var saved = savedCities[i];
            createCityCard(savedCities[i]);
        }
    }

    function createCityCard(city) {
        var cityCard = $('<div>').addClass('city-card p-3 border rounded-2 bg-success mb-3 text-center text-light');
        var cityName = $('<p>').text(city.keyword);
        cityCard.append(cityName);
        cityCard.on('click', function () {
            getApiByCity(city.keyword);
        });
        cityContainer.append(cityCard);
    }

    function getApi(event) {
        event.preventDefault();
        var city = searchInput.val();
        getApiByCity(city);
    }

    function getApiByCity(city) {
        var requestURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKEY;
        fetch(requestURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                console.log('list of forecasts:', data.list);

                $('.main-weather').empty();
                $('.main-five-day').empty();

                // Display today's weather as a placeholder (bigger version)
                displayTodayWeather(data.city.name, data.list[0]);

                // Display the 5-day forecast starting from tomorrow
                for (var i = 7; i < data.list.length; i += 8) {
                    displayFiveDay(data.list[i]);
                }

                // Save searched city to local storage
                saveCityToLocalStorage(data.city.name, city);
            })
            .catch(function (error) {
                console.error('Error fetching data:', error);
            });
    }

    function saveCityToLocalStorage(cityName, keyword) {
        var savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
        var existingCity = savedCities.find(function (city) {
            return city.keyword === keyword;
        });
        if (!existingCity) {
            var cityObject = { keyword: keyword };
            savedCities.push(cityObject);
            localStorage.setItem('savedCities', JSON.stringify(savedCities));
            createCityCard(cityObject);
        }
    }

    function displayTodayWeather(CityName, todayData) {
        var todayElement = $('<div>').addClass('p-3 col-md-12');
        var innerElement = $('<div>').addClass('p-3 border rounded-2 bg-light');

        var cityHeader = $('<h2>').text(CityName);
        var dateElement = $('<p>').text(new Date(todayData.dt_txt).toDateString());
        var iconElement = $('<img>').attr('src', 'https://openweathermap.org/img/w/' + todayData.weather[0].icon + '.png');
        var tempFahrenheit = (todayData.main.temp - 273.15) * 9 / 5 + 32;
        var tempElement = $('<p>').text('Temperature: ' + tempFahrenheit.toFixed(2) + ' °F');
        var windMetersPerSecond = todayData.wind.speed;
        var windMilesPerHour = windMetersPerSecond * 2.237;
        var windElement = $('<p>').text('Wind: ' + windMilesPerHour.toFixed(2) + ' MPH');
        var humidityElement = $('<p>').text('Humidity: ' + todayData.main.humidity + '%');

        innerElement.append(cityHeader, dateElement, iconElement, tempElement, windElement, humidityElement);
        todayElement.append(innerElement);
        $('.main-weather').append(todayElement);
    }

    function displayFiveDay(fiveDayData) {
        var fiveDayElement = $('<div>').addClass('p-3 col-md-2');
        var innerElement = $('<div>').addClass('p-3 border rounded-2 bg-light');

        var dateElement = $('<p>').text(new Date(fiveDayData.dt_txt).toDateString());
        var iconElement = $('<img>').attr('src', 'https://openweathermap.org/img/w/' + fiveDayData.weather[0].icon + '.png');
        var tempFahrenheit = (fiveDayData.main.temp - 273.15) * 9 / 5 + 32;
        var tempElement = $('<p>').text('Temperature: ' + tempFahrenheit.toFixed(2) + ' °F');
        var windMetersPerSecond = fiveDayData.wind.speed;
        var windMilesPerHour = windMetersPerSecond * 2.237;
        var windElement = $('<p>').text('Wind: ' + windMilesPerHour.toFixed(2) + ' MPH');
        var humidityElement = $('<p>').text('Humidity: ' + fiveDayData.main.humidity + '%');

        innerElement.append(dateElement, iconElement, tempElement, windElement, humidityElement);
        fiveDayElement.append(innerElement);
        $('.main-five-day').append(fiveDayElement);
    }


    searchButton.on('click', function (event) {
        getApi(event);
        searchInput.val('');
    })

    searchInput.on('keyup', function (event) {
        if (event.keyCode === 13) {
            getApi(event);
            searchInput.val('');
        }
    });

    loadSavedCities();

});