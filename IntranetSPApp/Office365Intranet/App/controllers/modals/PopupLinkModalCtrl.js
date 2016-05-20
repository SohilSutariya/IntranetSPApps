(function (app) {

    var PopupLinkModalCtrl = ["$scope", "$uibModalInstance", "$sce", "popupLink",

        function ($scope, $uibModalInstance, $sce, popupLink) {

            $scope.popupLink = popupLink;
            $scope.body = $sce.trustAsHtml($scope.popupLink.Pop_x0020_up_x0020_Contents);
            //$scope.body = $sce.trustAsHtml("<!DOCTYPE html><html lang='en' xmlns='http://www.w3.org/1999/xhtml'><head><link href='https://barminco.sharepoint.com/_layouts/15/1033/styles/Themable/corev15.css?rev=aNhtq4x2M1tMvccPBJqQXA%3D%3DTAG187' rel='stylesheet' /></head><body style='height:100%; overflow:visible;'>" + $scope.popupLink.Pop_x0020_up_x0020_Contents + "</body></html>");
            $scope.iframeSrc = $sce.trustAsResourceUrl("data:text/html;charset=utf-8, " + $scope.body);

            $scope.closeModal = function () {
                $uibModalInstance.dismiss('cancel');
            }

        }];

    app.controller("PopupLinkModalCtrl", PopupLinkModalCtrl);

}(angular.module("app")));