'use strict';
module.exports = [
    '$scope','$rootScope','Firebase','$stateParams','$ionicLoading','Analytics', function($scope,$rootScope,Firebase,$stateParams,$ionicLoading,Analytics) {
$scope.uid=$stateParams.id;
$rootScope.checkLogin();
    var jobsRef = firebase.database().ref('/jobs/');
    jobsRef.orderByChild('userid').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).on("value", function(jobs) {
       $scope.userOpenJobs=[];
        for(var key in jobs.val()){
                var d=jobs.val()[key];
                d.id=key;
                if(jobs.val()[key].status=="open")
                  $scope.userOpenJobs.push(d);
                
               if(!$scope.$$phase) {
                    $scope.$apply();
                    }
            }
             
    });

    $scope.inviteTalent=function(job)
    {
        if(job.id && $scope.uid)
        {
             $ionicLoading.show({
                  template: 'Sending...'
                });
                var fredRef = firebase.database().ref('/jobs/'+job.id+'/invites');
                 fredRef.orderByChild("userid").equalTo($scope.uid).once("value", function(snapshot) {
               
                
                if(snapshot.val()==null)
                {
                    fredRef.push({userid:$scope.uid});
                    var fredRef1 = firebase.database().ref('/users/'+$scope.uid+'/job_invitaion');
                    fredRef1.push({jobid:job.id});
                  
                    
                     var sendDate=new Date();
                      var notification_data=JSON.parse(angular.toJson({jobid:job.id,date:sendDate,type:'job_invitaion',sender:$rootScope.loggedUserId,senderName:$rootScope.userdata.name,status:'unread',message:$rootScope.userdata.name+" sent you an invitation to apply job."}));
                      var ref = firebase.database().ref('/notification/'+$scope.uid);
                      ref.push(notification_data);
                       $ionicLoading.hide();
                          alert("Invitation sent.");
                        }
                        else{ 
                        $ionicLoading.hide();
                        alert("Already sent");
                        }
            
           });
        }
    }
   Analytics.trackPage('Invite_For_Job'); 
}
];