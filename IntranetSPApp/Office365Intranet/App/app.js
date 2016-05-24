'use strict';

(function () {

    var app = angular.module("app", ["ngRoute", "ngCookies", "ngAnimate", "ngSanitize", "LocalStorageModule", "ui.bootstrap", "ui.bootstrap.tpls", "angular-loading-bar", "ui.select", "slickCarousel"]);

    var config = ["$routeProvider", "$httpProvider", "cfpLoadingBarProvider", 

        function ($routeProvider, $httpProvider, cfpLoadingBarProvider) {
            $routeProvider
                .when("/welcome",
                    {
                        templateUrl: "App/views/WelcomeView.html"
                    })
                .when("/search", 
                    {
                        templateUrl: "App/views/SearchView.html"
                    })
                .when("/playground",
                    {
                        templateUrl: "App/views/PlaygroundView.html"
                    })
                .otherwise(
                    { redirectTo: "/welcome" });

            $httpProvider.defaults.headers.common['Accept'] = 'application/json;odata=verbose';

            cfpLoadingBarProvider.includeSpinner = false;

        }];

    app.config(config);

}());