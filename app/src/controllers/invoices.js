'use strict';
module.exports = [
    '$scope','$rootScope','$http','$ionicLoading', function($scope,$rootScope,$http,$ionicLoading) {
	$rootScope.checkLogin();
}
];