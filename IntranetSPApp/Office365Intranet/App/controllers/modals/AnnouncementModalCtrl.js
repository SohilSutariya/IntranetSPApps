(function (app) {

    var AnnouncementModalCtrl = ["$scope", "$uibModalInstance", "$sce", "data",

        function ($scope, $uibModalInstance, $sce, data) {

            $scope.item = data;
            $scope.body = $sce.trustAsHtml($scope.item.Body);

        }];

    app.controller("AnnouncementModalCtrl", AnnouncementModalCtrl);

}(angular.module("app")));