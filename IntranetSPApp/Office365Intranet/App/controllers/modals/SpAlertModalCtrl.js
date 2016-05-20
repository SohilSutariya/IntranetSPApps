(function (app) {

    var SpAlertModalCtrl = ["$scope", "$uibModalInstance", "$sce", "spAlert",

        function ($scope, $uibModalInstance, $sce, spAlert) {

            $scope.spAlert = spAlert;
            $scope.body = $sce.trustAsHtml($scope.spAlert.Alert);

            $scope.closeModal = function () {
                $uibModalInstance.dismiss('cancel');
            }

        }];

    app.controller("SpAlertModalCtrl", SpAlertModalCtrl);

}(angular.module("app")));