'use strict';
module.exports = [
    '$scope','$ionicModal','$rootScope','Firebase','$ionicPopup','$stateParams','$ionicLoading','$location','$http','Analytics',function($scope,$ionicModal,$rootScope,Firebase,$ionicPopup,$stateParams,$ionicLoading,$location,$http,Analytics) {
 Analytics.trackPage('Payment_Using_Paypal_Fail');
 $rootScope.checkLogin();
}
];