'use strict';
module.exports = [
    '$scope','Analytics','$rootScope', function($scope,Analytics,$rootScope) {
 Analytics.trackPage('My_Finance');
 $rootScope.checkLogin();
}
];