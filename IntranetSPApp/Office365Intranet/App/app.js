'use strict';

(function () {

    var app = angular.module("app", ["ngRoute", "ngCookies", "ngAnimate", "LocalStorageModule", "ui.bootstrap", "ui.bootstrap.tpls", "angular-loading-bar"]);

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
                .otherwise(
                    { redirectTo: "/welcome" });

            $httpProvider.defaults.headers.common['Accept'] = 'application/json;odata=verbose';

            cfpLoadingBarProvider.includeSpinner = false;

        }];

    app.config(config);

}());