(function (app) {

    var CeoMsgModalCtrl = ["$scope", "$uibModalInstance", "$sce", "data",

        function ($scope, $uibModalInstance, $sce, data) {

            $scope.ceoMsg = data;

            $scope.closeModal = function () {
                $uibModalInstance.dismiss('cancel');
            }

        }];

    app.controller("CeoMsgModalCtrl", CeoMsgModalCtrl);

}(angular.module("app")));