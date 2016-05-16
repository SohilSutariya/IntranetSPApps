(function () {

    var app = angular.module("app", ["ngCookies"]);

    var Launcher = ["$cookies", "$window", "$location",

    function ($cookies, $window, $location) {

        // create sharepoint app context by moving params on querystring to an app cookie
        var appWebUrl = decodeURIComponent(jQuery.getQueryStringValue('SPAppWebUrl'));
        $cookies.put('SPAppWebUrl', appWebUrl);

        var url = decodeURIComponent(jQuery.getQueryStringValue('SPHostUrl'));
        $cookies.put('SPHostUrl', url);

        var title = decodeURIComponent(jQuery.getQueryStringValue('SPHostTitle'));
        $cookies.put('SPHostTitle', title);

        var logoUrl = decodeURIComponent(jQuery.getQueryStringValue('SPHostLogoUrl'));
        $cookies.put('SPHostLogoUrl', logoUrl);

        // redirect to main app page
        $window.location.href = appWebUrl + '/app.html';

    }];

    app.controller("Launcher", Launcher);

}());