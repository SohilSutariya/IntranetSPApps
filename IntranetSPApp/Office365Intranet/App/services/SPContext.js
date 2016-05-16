(function (app) {

    var SPContext = ["$cookies",  

    function ($cookies) {

        if (!$cookies.get('SPAppWebUrl'))
        {
            window.location = "https://barminco-04205473879f4f.sharepoint.com/sites/devsite/intranet/";
        }

        return {
            appWebUrl: $cookies.get('SPAppWebUrl'),
            hostUrl: $cookies.get('SPHostUrl')
        };

    }];

    app.factory("SPContext", SPContext);

}(angular.module("app")));