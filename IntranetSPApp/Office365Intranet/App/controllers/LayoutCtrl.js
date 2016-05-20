(function (app) {

    var LayoutCtrl = ["$scope", "DataService", "$filter", 

    function ($scope, DataService, $filter) {

        $scope.searchQuery = "";
        $scope.dropdown = [];

        DataService
            .getSpList("MenuNav")
            .success(function (data) {
                $scope.dropdown = data.d.results;
            });

        $scope.updateSearch = function () {
            $scope.$broadcast("updateSearch", { q: $scope.searchQuery });
        };


        /* EVENT LISTENERS */
        $scope.$on("updateSearch", function (event, data) {
            $scope.searchQuery = data.q;
        });
        /* /EVENT LISTENERS */

    }];

    app.controller("Layout", LayoutCtrl);

}(angular.module("app")));