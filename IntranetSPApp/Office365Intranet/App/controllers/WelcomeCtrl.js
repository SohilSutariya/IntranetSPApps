(function (app) {

    var WelcomeCtrl = ["$scope", "$window", "$filter", "$location", "$uibModal", "$sce", "localStorageService", "DataService", "WeatherService", 

    function ($scope, $window, $filter, $location, $uibModal, $sce, localStorageService, DataService, WeatherService) {

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
        

        /* SP ALERTS */
        DataService
            .getSpList("Alerts")
            .success(function (data) {
                $scope.spAlerts = data.d.results;
            })
            .error(function () {
                console.log("Error retrieving alerts");
            });
        /* /SP ALERTS */

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


        /* SAFETY STATS */
        DataService
            .getSpList("SafetyStats")
            .success(function (data) {
                console.log("Safety Stats retrieved:");
                console.log(data);

                $scope.safetyStats = data.d.results[0];
            })
            .error(function () {
                console.log("Error retrieving safety stats");
            });
        /* /SAFETY STATS */


        /* CEO MESSAGE */
        DataService
            .getSpList("CEOMsg", [{ name: "Status", value: "'Active'" }])
            .success(function (data) {
                if (!angular.isUndefined(data.d.results) && data.d.results.length > 0) {
                    $scope.ceoMsg = {
                        title: data.d.results[0].Title,
                        body: $sce.trustAsHtml(data.d.results[0].Body)
                    };


                }
            })
            .error(function (data) {
                console.log("Error retrieving CEO Message: ");
                console.log(data);
            });
        /* /CEO MESSAGE */


        /* COMPANY LINKS */
        DataService
            .getSpList("SiteLinks")
            .success(function (data) {
                $scope.siteLinks = data.d.results;
            })
            .error(function (data) {
                console.log("Failed to retrieve SiteLinks: ");
                console.log(data);
            });
        /* /COMPANY LINKS */


        /* COMMODITY */
        /* /COMMODITY */


        /* DATEPICKER */
        $scope.format = 'dd/MM/yyyy';
        $scope.popupDf = {
            opened: false
        };
        $scope.popupDt = {
            opened: false
        };
        $scope.df = new Date();
        $scope.dt = new Date();
        $scope.df.setDate($scope.dt.getDate() - 7);

        $scope.itemArray = [
            { id: 110575, name: 'Gold' },
            { id: 110568, name: 'Tin' },
            { id: 110563, name: 'Copper' },
            { id: 110564, name: 'Nickel' },
            { id: 110565, name: 'Zinc' },
        ];

        $scope.selected = { value: $scope.itemArray[0] };

        $scope.commodityUrl = "http://www.infomine.com/ChartsAndData/GraphEngine.ashx?z=f&gf=" + $scope.selected.value.id + ".AUD.oz&df=" + $filter('date')($scope.df, 'yyyyMMdd') + "&dt=" + $filter('date')($scope.dt, 'yyyyMMdd');

        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(),
            startingDay: 1,
            showWeeks: false
        };

        $scope.openDf = function () {
            $scope.popupDf.opened = true;
        };

        $scope.openDt = function () {
            $scope.popupDt.opened = true;
        };

        $scope.updateCommodityUrl = function () {
            if ($scope.dt < $scope.df) {
                $scope.df = new Date($scope.dt);
                $scope.df.setDate($scope.dt.getDate() - 7);
            }

            $scope.commodityUrl = "http://www.infomine.com/ChartsAndData/GraphEngine.ashx?z=f&gf=" + $scope.selected.value.id + ".AUD.oz&df=" + $filter('date')($scope.df, 'yyyyMMdd') + "&dt=" + $filter('date')($scope.dt, 'yyyyMMdd');
        };
        /* /DATEPICKER */


        /* SLICK CAROUSEL */

        $scope.slides = [
            {
                imgUrl: "../intranet/Images/Slideshow/1.jpg",
                title: "Welcome to Barminco",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            },
            {
                imgUrl: "../intranet/Images/Slideshow/2.jpg",
                title: "Safety First, Safety Foremost",
                text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem."
            },
            {
                imgUrl: "../intranet/Images/Slideshow/3.jpg",
                title: "Barminco hits five years LTI-free milestone",
                text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?"
            },
            {
                imgUrl: "../intranet/Images/Slideshow/4.jpg",
                title: "Underground Mining Excellence",
                text: "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure."
            },
        ];

        //$scope.updateNumber1 = function () {
        //    $scope.slickConfig1Loaded = false;
        //    $scope.number1[2] = '123';
        //    $scope.number1.push(Math.floor((Math.random() * 10) + 100));
        //    $timeout(function () {
        //        $scope.slickConfig1Loaded = true;
        //    }, 5);
        //};

        //$scope.slickCurrentIndex = 0;

        $scope.slickConfig = {
            dots: true,
            autoplay: true,
            initialSlide: 3,
            infinite: true,
            autoplaySpeed: 3000,
            method: {}//,
            //event: {
            //    beforeChange: function (event, slick, currentSlide, nextSlide) {
            //        console.log('before change', Math.floor((Math.random() * 10) + 100));
            //    },
            //    afterChange: function (event, slick, currentSlide, nextSlide) {
            //        $scope.slickCurrentIndex = currentSlide;
            //    },
            //    breakpoint: function (event, slick, breakpoint) {
            //        console.log('breakpoint');
            //    },
            //    destroy: function (event, slick) {
            //        console.log('destroy');
            //    },
            //    edge: function (event, slick, direction) {
            //        console.log('edge');
            //    },
            //    reInit: function (event, slick) {
            //        console.log('re-init');
            //    },
            //    init: function (event, slick) {
            //        console.log('init');
            //    },
            //    setPosition: function (evnet, slick) {
            //        console.log('setPosition');
            //    },
            //    swipe: function (event, slick, direction) {
            //        console.log('swipe');
            //    }
            //}
        };
        /* /SLICK CAROUSEL */


        /* MODALS */
        $scope.openSpAlert = function (spAlert) {
            var modalInstance = $uibModal.open({
                templateUrl: 'spAlertModal.html',
                controller: 'SpAlertModalCtrl',
                size: 'md',
                resolve: {
                    spAlert: function () {
                        return spAlert ;
                    }
                }
            });
        };

        $scope.openCeoMsg = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'ceoMsgModal.html',
                controller: 'CeoMsgModalCtrl',
                size: 'md',
                resolve: {
                    data: function () {
                        return $scope.ceoMsg;
                    }
                }
            });
        };

        $scope.openPopupLink = function (link) {
            var modalInstance = $uibModal.open({
                templateUrl: 'popupLinkModal.html',
                controller: 'PopupLinkModalCtrl',
                size: 'md',
                resolve: {
                    popupLink: function () {
                        return link;
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


        /* MISC */
        $scope.isPopUp = function (item) {
            return item.Link_x0020_Type == "Pop up";
        }
        /* /MISC */


        /* WEATHER ICON MAPPING */
        $scope.mapWeatherIcon = function(yahooCode) {

            return WeatherService.mapWeatherIcon(yahooCode);

        }
        /* WEATHER ICON MAPPING */

    }];

    app.controller("Welcome", WelcomeCtrl);

}(angular.module("app")));