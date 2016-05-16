(function (app) {

    var LayoutCtrl = ["$scope", "DataService", "$filter", 

    function ($scope, DataService, $filter) {

        $scope.searchQuery = "";
        $scope.dropdown = [];

        DataService
            .getSpLists()
            .success(function (data) {
                DataService
                    .getSpListByName("MenuNav", data.d.results)
                    .success(function (data) {
                        console.log("Menu nav retrieved successfully: ");
                        console.log(data);

                        $scope.dropdown = data.d.results;
                        console.log($scope.rootNavMenus);
                    })
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