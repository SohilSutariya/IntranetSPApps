(function (app) {

    var htmlToPlainText = [function () {
        return function (text) {
            return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        };
    }];

    app.filter("htmlToPlainText", htmlToPlainText);

})(angular.module("app"));