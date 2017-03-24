'use strict';
module.exports = [
    '$scope','$ionicModal','$rootScope','Firebase','$ionicPopup','$stateParams','$ionicLoading','$location',function($scope,$ionicModal,$rootScope,Firebase,$ionicPopup,$stateParams,$ionicLoading,$location) {
 $rootScope.checkLogin();
 if($stateParams.id)
 {
  $ionicLoading.show({
      template: 'Loading...'
    });
  				var myRootRef_job = firebase.database().ref('/jobs/'+$stateParams.id);
			        myRootRef_job.once("value", function(job) {
			        $scope.job=job.val();

 			var myRootRef_a = firebase.database().ref('/contracts/').orderByChild('jobid').equalTo($stateParams.id);
	            myRootRef_a.once("value", function(contracts) {
	            	$ionicLoading.hide();
	            	$scope.contracts=[];
	            	$scope.end_contracts=[];
	            	for(var key in contracts.val())
	            	{
	            		var d=contracts.val()[key];
	            		d.id=key;

	            		if(contracts.val()[key].status=="open")
	            			$scope.contracts.push(d);

	            		if(contracts.val()[key].status=="end")
	            			$scope.end_contracts.push(d);
	            	}
	            	
	            	
	            });
		});
	            
 }
 $scope.closejob=function()
 {
 		var myRootRef_job = firebase.database().ref('/jobs/'+$stateParams.id+"/status").set("end");
	           	$location.path("/app/workorganizer");
 }
}
];