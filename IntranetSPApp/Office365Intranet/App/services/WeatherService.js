(function (app) {

    var WeatherService = ["$http", "localStorageService",

        function ($http, localStorageService) {

            // Retrieve weather from Yahoo API
            var getWeather = function (locations) {

                var locationStr = "";

                angular.forEach(locations, function (value, key) {
                    if (key != 0) {
                        locationStr += "%20or";
                    }

                    locationStr += "%20text%3D%22" + value.Title + "%2C%20" + value.Country + "%22";

                });

                return $http.jsonp("https://query.yahooapis.com/v1/public/yql?q=select%20item.condition%2C%20link%2C%20location%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where" + locationStr + ")%20and%20u%3D'c'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK")

            };

            // Map yahoo weather code to weathericon glyphicon class
            var mapWeatherIcon = function (yahooCode) {
                var iconName = "";

                switch (yahooCode) {
                    case '0': iconName = "wi-tornado";
                        break;
                    case '1': iconName = "wi-storm-showers";
                        break;
                    case '2': iconName = "wi-tornado";
                        break;
                    case '3': iconName = "wi-thunderstorm";
                        break;
                    case '4': iconName = "wi-thunderstorm";
                        break;
                    case '5': iconName = "wi-snow";
                        break;
                    case '6': iconName = "wi-rain-mix";
                        break;
                    case '7': iconName = "wi-rain-mix";
                        break;
                    case '8': iconName = "wi-sprinkle";
                        break;
                    case '9': iconName = "wi-sprinkle";
                        break;
                    case '10': iconName = "wi-hail";
                        break;
                    case '11': iconName = "wi-showers";
                        break;
                    case '12': iconName = "wi-showers";
                        break;
                    case '13': iconName = "wi-snow";
                        break;
                    case '14': iconName = "wi-storm-showers";
                        break;
                    case '15': iconName = "wi-snow";
                        break;
                    case '16': iconName = "wi-snow";
                        break;
                    case '17': iconName = "wi-hail";
                        break;
                    case '18': iconName = "wi-hail";
                        break;
                    case '19': iconName = "wi-cloudy-gusts";
                        break;
                    case '20': iconName = "wi-fog";
                        break;
                    case '21': iconName = "wi-fog";
                        break;
                    case '22': iconName = "wi-fog";
                        break;
                    case '23': iconName = "wi-cloudy-gusts";
                        break;
                    case '24': iconName = "wi-cloudy-windy";
                        break;
                    case '25': iconName = "wi-thermometer";
                        break;
                    case '26': iconName = "wi-cloudy";
                        break;
                    case '27': iconName = "wi-night-cloudy";
                        break;
                    case '28': iconName = "wi-day-cloudy";
                        break;
                    case '29': iconName = "wi-night-cloudy";
                        break;
                    case '30': iconName = "wi-day-cloudy";
                        break;
                    case '31': iconName = "wi-night-clear";
                        break;
                    case '32': iconName = "wi-day-sunny";
                        break;
                    case '33': iconName = "wi-night-clear";
                        break;
                    case '34': iconName = "wi-day-sunny-overcast";
                        break;
                    case '35': iconName = "wi-hail";
                        break;
                    case '36': iconName = "wi-day-sunny";
                        break;
                    case '37': iconName = "wi-thunderstorm";
                        break;
                    case '38': iconName = "wi-thunderstorm";
                        break;
                    case '39': iconName = "wi-thunderstorm";
                        break;
                    case '40': iconName = "wi-storm-showers";
                        break;
                    case '41': iconName = "wi-snow";
                        break;
                    case '42': iconName = "wi-snow";
                        break;
                    case '43': iconName = "wi-snow";
                        break;
                    case '44': iconName = "wi-cloudy";
                        break;
                    case '45': iconName = "wi-lightning";
                        break;
                    case '46': iconName = "wi-snow";
                        break;
                    case '47': iconName = "wi-thunderstorm";
                        break;
                    case '3200': iconName = "wi-cloud";
                        break;
                    default: iconName = "wi-cloud";
                        break;
                }

                return iconName;
            }

            return {
                getWeather: getWeather,
                mapWeatherIcon: mapWeatherIcon
            };

        }];

    app.factory("WeatherService", WeatherService);

}(angular.module("app")));