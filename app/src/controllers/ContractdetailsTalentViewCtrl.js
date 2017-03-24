'use strict';
module.exports = [
   '$scope','$ionicModal','$rootScope','Analytics','$location','Firebase','$ionicPopup','$stateParams','$ionicLoading','$ionicActionSheet','$http',function($scope,$ionicModal,$rootScope,Analytics,$location,Firebase,$ionicPopup,$stateParams,$ionicLoading,$ionicActionSheet,$http) {
  $scope.contractId=$stateParams.id;
  $rootScope.checkLogin();
if($stateParams.id)
 {
 	$scope.contractId=$stateParams.id;
  $ionicLoading.show({
      template: 'Loading...'
    });
 			var myRootRef_a = firebase.database().ref('/contracts/'+$stateParams.id);
	            myRootRef_a.on("value", function(contract) {
	            	$scope.milestoneIsSubmitted=false;
                  $scope.milestoneIsWorking=false;
                  $scope.milestoneIsRemaining=false;
	            	$scope.contract=contract.val();
                $scope.contract.milestones.forEach(function(e,i){
                //for(var key in $scope.contract.milestones)
                //{
                  if(e.title)
                  {
                  if(!e.status)
                    $scope.milestoneIsRemaining=true;

                  if(e.status=='submitted')
                    $scope.milestoneIsSubmitted=true;
                  if(e.status=='working')
                    $scope.milestoneIsWorking=true;

                  }
                 

                //}
                });

                if(!$scope.$$phase) {
                   $scope.$apply();
                   
                 }
	            	var myRootRef_job = firebase.database().ref('/jobs/'+$scope.contract.jobid);
			            myRootRef_job.on("value", function(job) {
			            	$scope.job=job.val();

			            	var myRootRef_user = firebase.database().ref('/users/'+$scope.job.userid);
				            myRootRef_user.on("value", function(employer) {
				            	$ionicLoading.hide();
				            	$scope.employer=employer.val();
                                            setTimeout(function(){
                  var objDiv = document.getElementById("job-details-message-list"+$scope.contractId);
                  objDiv.scrollTop = objDiv.scrollHeight;
                },1000);
				            });
			            	
			            });
	            });
                var myRootRef_a = firebase.database().ref('/contracts/'+$stateParams.id);
              myRootRef_a.once("value", function(contract) {
                $scope.milestoneIsSubmitted=false;
                  $scope.milestoneIsWorking=false;
                  $scope.milestoneIsRemaining=false;
                $scope.contract=contract.val();
                $scope.contract.milestones.forEach(function(e,i){
                //for(var key in $scope.contract.milestones)
                //{
                  if(e.title)
                  {
                  if(!e.status)
                    $scope.milestoneIsRemaining=true;

                  if(e.status=='submitted')
                    $scope.milestoneIsSubmitted=true;
                  if(e.status=='working')
                    $scope.milestoneIsWorking=true;

                  }
                  if(i==$scope.contract.milestones.length-1)
                  {
                    setTimeout(function(){
                    if($scope.milestoneIsRemaining==false)
                      if($scope.milestoneIsWorking==false)
                       if($scope.milestoneIsSubmitted==false)
                                {
                               
                                  if($scope.contract.status!="end")
                                  {
                                     console.log("2="+$scope.contract.status);
                                    if($scope.contract.feedbackbyEmployer && $scope.contract.feedbackbyTalent)
                                    {

                                    firebase.database().ref('/contracts/'+$stateParams.id+"/status").set("end");
                                    }
                                    else
                                    {
                                        firebase.database().ref('/contracts/'+$stateParams.id+"/status").set("completed");
                                  
                                    }
                                  }
                                }
                    },1000);
                  }

                //}
                });

                if(!$scope.$$phase) {
                   $scope.$apply();
                   
                 }
               
              });

	            
 }
 $scope.proposalchat=[];
 $scope.sendMessage=function()
 {

	if($scope.proposalchat.message)
	{
	 	var sendDate=new Date();
	 	var new_data=JSON.parse(angular.toJson({message:$scope.proposalchat.message,date:sendDate,type:'talent',status:'unread'}));
	 	var myRootRef_proposal_message = firebase.database().ref('/contracts/'+$stateParams.id+"/message");
	 	myRootRef_proposal_message.push(new_data);
    var notification_data=JSON.parse(angular.toJson({date:sendDate,message:$rootScope.userdata.name+'(Talent) sent you a message on proposal of "'+$scope.job.title+'"',type:'contractmessage',sender:$rootScope.loggedUserId,senderName:$rootScope.userdata.name,status:'unread'}));
    var ref = firebase.database().ref('/notification/'+$scope.contract.employer_id);
    ref.push(notification_data);
	 	$scope.proposalchat.message="";
    var objDiv = document.getElementById("job-details-message-list"+$scope.contractId);
    objDiv.scrollTop = objDiv.scrollHeight;
	 }
  }
  // A confirm dialog
 $scope.confirmEndcontract = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'End Contract',
     template: 'Are you sure you want to end the contract?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       $ionicLoading.show({
        template: 'Processing...'
      });
         /* if($scope.milestoneIsSubmitted==true)
          {

                  var myRootRef_check_trans_escrow =firebase.database().ref("/transactions/").orderByChild('contractid').equalTo($stateParams.id);
                  myRootRef_check_trans_escrow.once('value',function(transactions){
                    if(transactions.val())
                    {
                      $ionicLoading.show({
                      template: 'Processing...'
                    });
                      $http({
                        method: 'POST',
                        url: window.location.origin+'/endcontract.php',
                         data: {token:$rootScope.loggedUserId,contract:$stateParams.id,transactions:transactions.val(),endby:'talent'},
                         headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                      }).then(function successCallback(response) {
                        $ionicLoading.show({
                          template: 'Processing...'
                        });
                        console.log(response);
                        if(response.data=="success")
                        {
                          var sendDate=new Date();
                          var myRootRef_a = firebase.database().ref('/contracts/'+$stateParams.id);
                          myRootRef_a.update({endContractBeforeAppoved:"true",endby:"talent",contract_hold_on:sendDate});
                          var new_data=JSON.parse(angular.toJson({message:"Contract end. *",date:sendDate,type:'talent',system_message:"true",status:'unread'}));
                          var myRootRef_proposal_message = firebase.database().ref('/contracts/'+$stateParams.id+"/message");
                          myRootRef_proposal_message.push(new_data);
                          $ionicLoading.hide();
                        }    
                      }, function errorCallback(response) {
                        $ionicLoading.hide();
                              
                      });
                  }
                }); 
          }
          else
          {*/
            
                        var myRootRef_check = firebase.database().ref('/contracts/'+$stateParams.id);
                        myRootRef_check.once('value',function(contract){

                          if(contract.val())
                          {
                            var myRootRef_check_trans_escrow =firebase.database().ref("/transactions/").orderByChild('contractid').equalTo($stateParams.id);
                            myRootRef_check_trans_escrow.once('value',function(transactions){
                              $http({
                                        method: 'POST',
                                        url: window.location.origin+'/transaction.php',
                                         data: {token:$rootScope.loggedUserId,type:'endcontract',domain:window.location.origin,contract:$stateParams.id,job:contract.val().jobid,transactions:transactions.val()},
                                         headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                                      }).then(function successCallback(response) {
                                        
                                        $ionicLoading.hide();
                                        if(response.data=="success")
                                        {
                                              var sendDate=new Date();
                                              var myRootRef_a = firebase.database().ref('/contracts/'+$stateParams.id);
                                              if(contract.val().status=='completed'){
                                                $rootScope.givefeedbackby="talent";
                                                $location.path("/app/contractfeedback/"+$stateParams.id);
                                              }
                                              else
                                              {
                                                var new_data=JSON.parse(angular.toJson({message:'contracted ended by talent, milestone refund. *',date:sendDate,type:'talent',status:'unread',system_message:"true"}));
                                                var myRootRef_proposal_message = firebase.database().ref('/contracts/'+$scope.contractId+"/message");
                                                myRootRef_proposal_message.push(new_data);
                                                var myRootRef_a = firebase.database().ref('/contracts/'+$stateParams.id);
                                                myRootRef_a.update({status:"completed",contract_completed_on:sendDate});
                                                
                                                var myRootRef_job = firebase.database().ref('/jobs/'+$scope.contract.jobid+"/status").set("completed");
                                                myRootRef_a.update({endby:"talent"});
                                              }
                                              var myRootRef_job_get = firebase.database().ref('/jobs/'+contract.val().jobid);
                                              myRootRef_job_get.once('value',function(job){
                                                var myRootRef_timeline = firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/timeline');
                                                var collectionRef_timeline = myRootRef_timeline.push({publishAt:sendDate.toString(),title:'Job Completed.',subTitle:job.val().title,description:job.val().description,type:"jobs",reference:contract.val().jobid,statusline:""});
                                                $ionicLoading.hide(); 
                                                $rootScope.givefeedbackby="talent";
                                                $location.path("/app/contractfeedback/"+$stateParams.id);
                                              });
                                  

                                    }
                                       
                          }, function errorCallback(response) {
                                        console.log("error");
                                  $ionicLoading.hide();
                                      });
                                      });
                          }
                        });
            

          //}
	           
	 	
     } else {
       console.log('You are not sure');
     }
   });
 };
 $scope.givefeedback=function()
 {
 	$rootScope.givefeedbackby="talent";
	$location.path("/app/contractfeedback/"+$stateParams.id);

 }
 $scope.messageMoreOptions=function(id,data,chatindex)
{
	// Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
      { text: 'Translate' },
       ],
     cancelText: 'Cancel',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
     	if(index==0)
     	{
     	var text=$('#'+id+chatindex).html();

     	 $('#'+id+chatindex).html("<img src='img/smallloading.gif' style='height:16px;width:28px'/>");
     	
     	var url=window.location.origin+'/translation.php';

     		$http({
                      method: 'POST',
                      url: url,
                       data: { text:text},
                       headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }).then(function successCallback(response) {
                   
                       $('#'+id+chatindex).html(response.data.text);

                      }, function errorCallback(response) {
                      console.log(response);
                      });
     	}
     	
       return true;
     }
   });

  
}
$scope.submitMilestoneWork=function()
{
  for(var key in $scope.contract.milestones)
   {
      if($scope.contract.milestones[key].status=='working')
        $location.path('/app/submitmilestone/'+$scope.contractId+'/'+key);
      
  }
}
$scope.MoreOptions=function(data,id)
{
if(data)
  {
  // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
      { text: 'Translate' },
       ],
     cancelText: 'Cancel',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
 
      if(index==0)
      {
      var text=data;
       $('#'+id).html("<img src='img/smallloading.gif' style='height:16px;width:28px'/>");
     
      var url=window.location.origin+'/translation.php';

        $http({
                      method: 'POST',
                      url: url,
                       data: { text:text},
                       headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }).then(function successCallback(response) {
                      
                       $('#'+id).html(response.data.text);

                      }, function errorCallback(response) {
                      console.log(response);
                      });
      }
      
       return true;
     }
   });

}
  
}
$scope.dispute=function()
{
  var confirmPopup = $ionicPopup.confirm({
     title: 'Confirm',
     template: 'Are you sure you want to dispute?'
   });

   confirmPopup.then(function(res) {
     if(res) {
      var sendDate=new Date();
     

      var myRootRef_endcontractRequests = firebase.database().ref('/endcontractRequests').orderByChild('contract').equalTo($stateParams.id).once("value", function(endcontractRequests) {
        if(endcontractRequests.val())
        {
          for(var key in endcontractRequests.val())
          {
            if(key)
             var myRootRef_endcontractRequests_dispute =firebase.database().ref('/endcontractRequests').child(key).update({'dispute':'true'});
          }
           var myRootRef_contract = firebase.database().ref('/contracts/'+$stateParams.id);
          myRootRef_contract.update({'dispute':'true'});
          
          var myRootRef_job = firebase.database().ref('/jobs/'+$scope.contract.jobid);
          myRootRef_job.update({'dispute':'true'});

          var new_data=JSON.parse(angular.toJson({date:sendDate,contract:$scope.contract,status:"open",contractid:$stateParams.id,jobid:$scope.contract.jobid}));
          var dispute = firebase.database().ref('/disputes');
          dispute.push(new_data);
          
        }
      });     


      
    
     } else {
       console.log('You are not sure');
     }
   });
}
Analytics.trackPage('Contract_Talent_View');
}
];