'use strict';
module.exports = [
   '$scope','$ionicModal','$rootScope','Firebase','$ionicPopup','$stateParams','$ionicLoading','Analytics', function($scope,$ionicModal,$rootScope,Firebase,$ionicPopup,$stateParams,$ionicLoading,Analytics) {
 $rootScope.checkLogin();
  if($stateParams.id)
 {
 	$scope.jobid=$stateParams.id;
    $ionicLoading.show({
      template: 'Loading...'
    });
	var myRootRef_a = firebase.database().ref('/jobs/'+$stateParams.id);
    myRootRef_a.once("value", function(job) {
    	$scope.job=job.val();
        $ionicLoading.hide();
    });
 
  	           
 }	
 Analytics.trackPage('Job_Details');
}
];