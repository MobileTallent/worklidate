'use strict';
module.exports = [
   '$scope','$ionicModal','$rootScope','Firebase','$ionicPopup','$stateParams','$ionicLoading','Analytics',function($scope,$ionicModal,$rootScope,Firebase,$ionicPopup,$stateParams,$ionicLoading,Analytics) {
$rootScope.checkLogin();
if($stateParams.id)
 {
  $ionicLoading.show({
      template: 'Loading...'
    });
 			var myRootRef_a = firebase.database().ref('/jobproposals/').orderByChild('jobid').equalTo($stateParams.id);
	            myRootRef_a.on("value", function(proposals) {
	            	$ionicLoading.hide();
	            	$scope.proposals=proposals.val();
                if(!$scope.$$phase) {
                    $scope.$apply();
                    }
	            });
              var myRootRef_j = firebase.database().ref('/jobs/'+$stateParams.id)
              myRootRef_j.once("value", function(job) {
               
                $scope.job=job.val();
                if(!$scope.$$phase) {
                    $scope.$apply();
                    }
              });
	            
 }
  $scope.telentWorkingContracts=[];
   $scope.telentEndContracts=[];
 $scope.getJobStatus=function(userId)
 {
 	$scope.telentWorkingContracts[userId]=0;
   $scope.telentEndContracts[userId]=0;
    var proposalRef = firebase.database().ref('/contracts/');
    proposalRef.orderByChild('talent_id').equalTo(userId).once("value", function(proposals) {
       
        for(var key in proposals.val()){
               
                if(proposals.val()[key].status=="open")
                    $scope.telentWorkingContracts[userId]=$scope.telentWorkingContracts[userId]+1;
                  if(proposals.val()[key].status=="end")
                     $scope.telentEndContracts[userId]=$scope.telentEndContracts[userId]+1;

            }
            if(!$scope.$$phase) {
                    $scope.$apply();
                    }
    });
}
Analytics.trackPage('Proposal_List');
}
];