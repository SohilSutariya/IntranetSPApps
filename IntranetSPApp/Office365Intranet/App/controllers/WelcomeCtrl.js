(function (app) {

    var WelcomeCtrl = ["$scope", "$filter", "$location", "$uibModal", "$sce", "localStorageService", "DataService", "WeatherService",

    function ($scope, $filter, $location, $uibModal, $sce, localStorageService, DataService, WeatherService) {

        $scope.weatherData = [];
        $scope.appLinks = [];

        /* PLACEHOLDER DATA */
        $scope.calendar = [
            { date: '09 Oct', description: "Lorem ipsum dolor sit amet" },
            { date: '21 Oct', description: "Ut enim ad minim veniam, quis nostrud exercitation" },
            { date: '14 Sept', description: "Excepteur sint occaecat" },
            { date: '16 Sept', description: "Sed ut perspiciatis" },
            { date: '02 Nov', description: "Neque porro quisquam est" },
            { date: '31 Dec', description: "Quis autem vel eum iure reprehenderit qui in ea" },
        ];

        $scope.news = [
            { date: '09 Oct', description: "Barminco receives re-certification from Sai Global" },
            { date: '21 Oct', description: "Barminco completes further repurchase of US high yield bonds" },
            { date: '14 Sept', description: "Barminco releases FY2015 results" },
            { date: '16 Sept', description: "Barminco awarded contracts at Sirius Nova nickel mine" },
            { date: '02 Nov', description: "Barminco repurchases additional US high yield bonds" },
            { date: '31 Dec', description: "Barminco awarded $110 million contract in Tasmania" },
        ];
        /* /PLACEHOLDER DATA */


        /* IMAGE CAROUSEL */
        var slides = $scope.slides = [];
        var currIndex = 0;

        $scope.addSlide = function () {
            slides.push({
                image: '../intranet/Images/Slideshow/' + (slides.length + 1) + '.jpg',
                text: ['Nice image', 'Awesome photograph', 'That is so cool', 'I love that'][slides.length % 4],
                id: currIndex++
            });
        };

        for (var i = 0; i < 4; i++) {
            $scope.addSlide();
        }
        /* /IMAGE CAROUSEL */


        /* ANNOUNCEMENTS */
        DataService
            .getSpList("Announcements")
            .success(function (data) {
                $scope.announcements = data.d.results;
            })
            .error(function () {
                console.log("Error retrieving announcements");
            });
        /* /ANNOUNCEMENTS */

        /* NewsLetters */
        DataService
            .getSpList("Newsletters")
            .success(function (data) {
                $scope.newsletters = data.d.results;
            })
            .error(function () {
                console.log("Error retrieving Newsletters");
            });
        /* /NewsLetters */

        /* APP LINKS */
        DataService
            .getSpList("Applications")
            .success(function (data) {
                $scope.appLinks = data.d.results;
            })
            .error(function () {
                console.log("Error retrieving links");
            });
        /* /APP LINKS */


        /* WEATHER DATA */
        var cachedWeather = localStorageService.get("weatherData");
        if (cachedWeather != null && (Math.abs(Date.now() - cachedWeather.date) / 60000) < 60) {
            // Cached data exists and is less than an hour old
            $scope.weatherData = cachedWeather.data;
        }
        else {
            DataService
                .getSpList("WeatherList")
                .success(function (data) {
                    WeatherService
                        .getWeather(data.d.results)
                        .success(function (data) {
                            $scope.weatherData = data.query.results.channel;
                            localStorageService.set("weatherData", { data: $scope.weatherData, date: Date.now() });
                        })
                        .error(function (data) {
                            console.log("Failed to retrieve weather info: ");
                            console.log(data);
                        });
                })
                .error(function () {
                    console.log("Error retrieving weatherlist");
                });
        }

        DataService
            .postTest()
            .success(function (data) {
                console.log("Post success: ");
                console.log(data);
            })
            .error(function (data) {
                console.log("Post failed: ");
                console.log(data);
            });
        /* /WEATHER DATA */


        /* SAFETY REPORTS */
        DataService
            .getSpList("SafetyRpt", [{ name: "Status", value: "'Active'" }])
            .success(function (data) {
                $scope.safetyReports = data.d.results;
            })
            .error(function () {
                console.log("Error retrieving safety reports");
            });
        /* /SAFETY REPORTS */


        /* MODALS */
        $scope.openAnnouncement = function (item) {
            var modalInstance = $uibModal.open({
                templateUrl: 'announcementModal.html',
                controller: 'AnnouncementModalCtrl',
                size: 'md',
                resolve: {
                    data: function () {
                        return item;
                    }
                }
            });
        };
        /* /MODALS */


        /* EVENT LISTENERS */
        $scope.$on("updateSearch", function (event, args) {
            console.log("Picked up broadcast");
            $location.path("/search");
        });
        /* /EVENT LISTENERS */


        /* WEATHER ICON MAPPING */
        $scope.mapWeatherIcon = function (yahooCode) {

            return WeatherService.mapWeatherIcon(yahooCode);

        }
        /* WEATHER ICON MAPPING */

    }];

    app.controller("Welcome", WelcomeCtrl);

}(angular.module("app")));