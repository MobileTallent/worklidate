'use strict';
module.exports = [
    '$scope','Firebase','$state','$rootScope','$ionicLoading','$ionicModal','$http','$ionicPopup', function($scope,Firebase,$state,$rootScope,$ionicLoading,$ionicModal,$http,$ionicPopup) {
$scope.showForm=true;
$scope.payNow=function(c,type)
{
	$scope.showForm=false;
	$http({
          method: 'POST',
          url: window.location.origin+'/first.php',
           data: {token:$rootScope.loggedUserId,n:c.number,cv:c.cvc,fname:c.fname,lname:c.lname,expM:c.expiration.month,expY:c.expiration.year,amt:50,curr:'USD',type:type.toLowerCase(),itemName:"Ground Coffee 40 oz",itenDescription:"Ground Coffee 40 oz Description"},
           headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function successCallback(response) {
        		
        		$scope.showresult=true;
        		$scope.result=response.data;
        }, function errorCallback(response) {
        	$scope.showresult=true;
              				$ionicLoading.hide();
              	
        });
}
}
];