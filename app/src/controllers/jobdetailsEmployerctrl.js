'use strict';
module.exports = [
    '$scope','$ionicModal','$rootScope','Firebase','$ionicPopup','$stateParams','$ionicLoading','$location','Analytics', function($scope,$ionicModal,$rootScope,Firebase,$ionicPopup,$stateParams,$ionicLoading,$location,Analytics) {
 $rootScope.checkLogin();
  if($stateParams.id)
 {
 	$scope.jobid=$stateParams.id;
    $ionicLoading.show({
      template: 'Loading...'
    });
	var myRootRef_a = firebase.database().ref('/jobs/'+$stateParams.id);
    myRootRef_a.once("value", function(job) {
    	
      if(job.val().userid==$rootScope.loggedUserId)
      {
        if(job.val().status=='open')
        $scope.job=job.val();
      }
        $ionicLoading.hide();
      
    });
	  $scope.removeJob=function()
  {
    if($stateParams.id)
    {
       var confirmPopup = $ionicPopup.confirm({
     title: 'Remove Job',
     template: 'Are you sure you want to remove this job?'
   });

   confirmPopup.then(function(res) {
     if(res) {
          $ionicLoading.show({
        template: 'Loading...'
      });
      var myRootRef_a_j = firebase.database().ref('/jobs/'+$stateParams.id);
      myRootRef_a_j.once("value", function(job) {
      if(job.val())
      {
        var jobtitle=job.val().title;
        var myRootRef_a = firebase.database().ref('/jobproposals/').orderByChild('jobid').equalTo($stateParams.id);
              myRootRef_a.once("value", function(proposals) {
                $ionicLoading.hide();
                $scope.proposals=proposals.val();
                for(var key in $scope.proposals)
                {
                  if($scope.proposals[key].talent_id)
                  {
                    var sendDate=new Date();
                  var notification_data=JSON.parse(angular.toJson({date:sendDate,message:$rootScope.userdata.name+'(Employer) deleted a job "'+jobtitle+'"',type:'contractmessage',sender:$rootScope.loggedUserId,senderName:$rootScope.userdata.name,status:'unread'}));
                  var ref = firebase.database().ref('/notification/'+$scope.proposals[key].talent_id);
                  ref.push(notification_data);
                    var myRootRef_jobproposals = firebase.database().ref('/jobproposals/'+key);
                    myRootRef_jobproposals.remove();
                  }
                  
                }
              });

        myRootRef_a_j.remove();
        $ionicLoading.hide();
         $location.path("/app/workorganizer");
      }
      else
      {
        $ionicLoading.hide();
      }
        
      
      
    });

     } else {
       console.log('You are not sure');
     }
   });

      
      }
  }          
 }	
  Analytics.trackPage('Job_Details');
}
];