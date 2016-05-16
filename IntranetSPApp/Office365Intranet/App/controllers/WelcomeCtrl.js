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

        
        /* WEATHER DATA */
        var cachedWeather = localStorageService.get("weatherData");
        if (cachedWeather != null && (Math.abs(Date.now() - cachedWeather.date) / 60000) < 60) {
            // Cached data exists and is less than an hour old
            $scope.weatherData = cachedWeather.data;
        }
        else {
            WeatherService
                .getWeather()
                .success(function (data) {
                    console.log("Retrieved weather info successfully: ");
                    console.log(data);

                    $scope.weatherData = data.query.results.channel;
                    localStorageService.set("weatherData", { data: $scope.weatherData, date: Date.now() });
                })
                .error(function (data) {
                    console.log("Failed to retrieve weather info: ");
                    console.log(data);
                });
        }
        /* /WEATHER DATA */


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
        

        DataService
            .getSpLists()
            .success(function (data) {
                console.log("SpLists retrieved successfully: ");
                console.log(data);
                $scope.spLists = data.d.results;

                /* ANNOUNCEMENTS */
                DataService
                    .getSpListByName("Announcements", $scope.spLists)
                    .success(function (data) {
                        console.log("Successfully retrieved announcements: ");
                        console.log(data);
                        $scope.announcements = data.d.results;
                    })
                    .error(function () {
                        console.log("Error retrieving announcements");
                    });
                /* /ANNOUNCEMENTS */


                /* APP LINKS */
                DataService
                    .getSpListByName("Applications", $scope.spLists)
                    .success(function (data) {
                        console.log("Successfully retrieved application links: ");
                        console.log(data);
                        $scope.appLinks = data.d.results;
                    })
                    .error(function () {
                        console.log("Error retrieving links");
                    });
                /* /APP LINKS */

            })
            .error(function (data) {
                console.log("Error retrieving SpLists: ");
                console.log(data);
            });


        /* MODALS */
        $scope.openAnnouncement = function (item) {
            var modalInstance = $uibModal.open({
                templateUrl: 'announcementModal.html',
                controller: 'AnnouncementModalCtrl',
                size: 'md',
                resolve: {
                    data: function () {
                        return item ;
                    }
                }
            });
        };
        /* /MODALS */


        /* MISC */
        var getSpList = function (name) {

            var listId = ($filter('filter')($scope.spLists, { Title: name }, true));
            if (listId.length > 0) {
                listId = listId[0]["Id"];

                DataService
                    .getSpListItems(listId)
                    .success(function (data) {
                        return data.d.results;
                    })
                    .error(function () {
                        console.log("Error retrieving " + name + " SpList");
                    });
            }

        }
        /* /MISC */


        /* EVENT LISTENERS */
        $scope.$on("updateSearch", function (event, args) {
            console.log("Picked up broadcast");
            $location.path("/search");
        });
        /* /EVENT LISTENERS */


        /* WEATHER ICON MAPPING */
        $scope.mapWeatherIcon = function(yahooCode) {

            return WeatherService.mapWeatherIcon(yahooCode);

        }
        /* WEATHER ICON MAPPING */

    }];

    app.controller("Welcome", WelcomeCtrl);

}(angular.module("app")));