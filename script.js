var searchHistory = JSON.parse(localStorage.getItem("cities")) || [];

//The search button click event listener
$("#searchButton").on("click", function () {
    var searchData = $("#weather-input").val().trim();

    callWeatherTemps(searchData);
});

//The API Call One Day function
function callWeatherTemps(city) {
    var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6ec271a7eaa197efb35f9b736da2f3eb"; 
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        searchHistory.unshift(response.name);

    //Removes Duplicates from the searchHistory
    searchHistory = Array.from(new Set(searchHistory));
    localStorage.setItem("cities", JSON.stringify(searchHistory));
    displaySearchHistory(searchHistory);

//When button is pressed empties the weather-append div 
$("#weather-append").empty();
//Converts to Celsius from Kelvin
var celsius = (response.main.temp - 273.15);
$(".current-temp").text("Temperature: " + celsius.toFixed(2) + "°C");

//Gets Humidity from response
    var humidity = response.main.humidity + "%";
//Gets wind from response
    var wind = response.wind.speed;
//Makes the card for the current weather
    var cardBody = $("<div>").addClass("card-body");
    var cardTitle = $("<h3>")
    .addClass("card-title")
    .text(response.name + " " + new Date().toLocaleDateString());

//appends weather icons from the api
    cardTitle.append(
        '<img src="http://openweathermap.org/img/wn/' + response.weather[0].icon + '.png" >'
);

//Adds text to the p tags to the DOM
var cardTemp = $("<p>").text("Temperature: " + celsius);
var cardHumidity = $("<p>").text("Humidity: " + humidity);
var cardWind = $("<p>").text("Wind Speed: " + wind);

//Appends the Weather to the page
$("#weather-append").append(
    cardBody,
    cardTitle,
    cardTemp,
    cardHumidity,
    cardWind
);
callUVIndex(response.coord.lat, response.coord.lon);
callFiveDay(response.coord.lat, response.coord.lon);
});
}

//An API call for the UV index
function callUVIndex(lat, lon) {
    var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=6ec271a7eaa197efb35f9b736da2f3eb";
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
    //Gets a response from UV for the API to DOM
    var uv = response.value;
    var cardUV = $("<p>").text("UV Index: " + uv);
    $("#weather-append").append(cardUV);
});
}

//A Call to API that get the 5 day forecast
function callFiveDay(lat, lon) {
    var queryURL =
    " https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=76b47d9ec5f969b523699c85ac871f4f";
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        var dayArray = response.daily;

//empties the five day results
    $("#fiveday-append").empty();

    for (var i = 0; i < 5; i++) {
        var forecastWeather = dayArray[i + 1];
        var date = new Date(forecastWeather.dt * 1000);
        var celsius = (forecastWeather.temp.day - 273.15);
        ( + celsius.toFixed(2) + "°C");

            var cardBody = $("<div>").addClass("card-body");
            var cardTitle = $("<h3>")
            .addClass("card-title")
            .text(date.toLocaleDateString());

//Appends icon weather to the five day forecast.
      cardTitle.append( '<img src="http://openweathermap.org/img/wn/' + forecastWeather.weather[0].icon + '.png" >');
        var cardTemp = $("<p>").text("Temperature: " + celsius);

        $("#fiveday-append").append(cardBody, cardTitle, cardTemp);
    }
});
}

//Shows the search history of previous city searches
function displaySearchHistory(cities) {

//Clears the search histories results
$("#search-history").empty();
for (var i = 0; i < cities.length; i++) {
    let city = cities[i];
    var li = $("<li>").addClass("list-group-item").text(city);
    li.on("click", function () {
        callWeatherTemps(city);
    });
    $("#search-history").append(li);
}
}

displaySearchHistory(searchHistory);






