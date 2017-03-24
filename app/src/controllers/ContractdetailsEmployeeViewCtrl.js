'use strict';
module.exports = [
    '$scope','$location','$ionicModal','Analytics','$rootScope','Firebase','$ionicPopup','$stateParams','$ionicLoading','$ionicActionSheet','$http',function($scope,$location,$ionicModal,Analytics,$rootScope,Firebase,$ionicPopup,$stateParams,$ionicLoading,$ionicActionSheet,$http) {
 $scope.contractId=$stateParams.id;
 $rootScope.checkLogin();

 if($rootScope.reloadContractPage==true)
    location.reload();

if($stateParams.id)
 {
 	$scope.contractId=$stateParams.id;
  $ionicLoading.show({
      template: 'Loading...'
    });
 			var myRootRef_a = firebase.database().ref('/contracts/'+$stateParams.id);
	            myRootRef_a.on("value", function(contract) {
              
	            	//$ionicLoading.hide();
	            	if(contract.val())
	            	{
                  $scope.milestoneIsSubmitted=false;
                  $scope.milestoneIsWorking=false;
                  $scope.milestoneIsRemaining=false;
	            	$scope.contract=contract.val();
                $scope.contract.milestones.forEach(function(e,i){
                    //for(var key in $scope.contract.milestones)
                      //  {
                          if(e.title)
                          {
                              if(e.title)
                            {
                              if(!e.status)
                                $scope.milestoneIsRemaining=true;

                              if(e.status=='submitted')
                                $scope.milestoneIsSubmitted=true;
                              if(e.status=='working')
                                $scope.milestoneIsWorking=true;
                            }
                          }
                        
                      //}

                });
        	            
                        if(!$scope.$$phase) {
                          $scope.$apply();
                   
                        }
	            	var myRootRef_job = firebase.database().ref('/jobs/'+$scope.contract.jobid);
			            myRootRef_job.on("value", function(job) {
			            	$scope.job=job.val();

			            	var myRootRef_user = firebase.database().ref('/users/'+$scope.contract.talent_id);
				            myRootRef_user.on("value", function(talent) {
				            	$ionicLoading.hide();
				            	$scope.talent=talent.val();
                      setTimeout(function(){
                        if(document.getElementById("job-details-message-list"+$scope.contractId))
                        {
                  var objDiv = document.getElementById("job-details-message-list"+$scope.contractId);
                  objDiv.scrollTop = objDiv.scrollHeight;
                }
                },1000);
				            });
			            	
			            });
                
			        }
			      
	            });
	      var myRootRef_a = firebase.database().ref('/contracts/'+$stateParams.id);
              myRootRef_a.once("value", function(contract) {
              console.log(contract.val());
                //$ionicLoading.hide();
                if(contract.val())
                {
                  $scope.milestoneIsSubmitted=false;
                  $scope.milestoneIsWorking=false;
                  $scope.milestoneIsRemaining=false;
                $scope.contract=contract.val();
                $scope.contract.milestones.forEach(function(e,i){
                    //for(var key in $scope.contract.milestones)
                      //  {
                          if(e.title)
                          {
                              if(e.title)
                            {
                              if(!e.status)
                                $scope.milestoneIsRemaining=true;

                              if(e.status=='submitted')
                                $scope.milestoneIsSubmitted=true;
                              if(e.status=='working')
                                $scope.milestoneIsWorking=true;
                            }
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
              
              }
             
              });      
 }
 $scope.assingmilestone=function()
 {
 	if($scope.contract!=null && $scope.milestoneIsRemaining==true && $scope.contract.assigned_milestone=='false' && $stateParams.id)
 	{
 		$location.path('/app/assignmilestone/'+$stateParams.id);
 	}
 }
 $scope.proposalchat=[];
 $scope.sendMessage=function()
 {

	if($scope.proposalchat.message)
	{
	 	var sendDate=new Date();
	 	var new_data=JSON.parse(angular.toJson({message:$scope.proposalchat.message,date:sendDate,type:'employer',status:'unread'}));
	 	var myRootRef_proposal_message = firebase.database().ref('/contracts/'+$stateParams.id+"/message");
	 	myRootRef_proposal_message.push(new_data);
    
    var notification_data=JSON.parse(angular.toJson({date:sendDate,message:$rootScope.userdata.name+'(Employer) sent you a message on proposal of "'+$scope.job.title+'"',type:'contractmessage',sender:$rootScope.loggedUserId,senderName:$rootScope.userdata.name,status:'unread'}));
    var ref = firebase.database().ref('/notification/'+$scope.contract.talent_id);
    ref.push(notification_data);

	 	$scope.proposalchat.message="";
    if(document.getElementById("job-details-message-list"+$scope.contractId))
    {
    var objDiv = document.getElementById("job-details-message-list"+$scope.contractId);
    objDiv.scrollTop = objDiv.scrollHeight;
  }
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
     			if($rootScope.getObjectLength($scope.contract.allSubmittedMilestonesData)>0)
          {
            $scope.endContractProcess(true);
          }
          else
          {
            $scope.endContractProcess(false);
          }

     } else {
       console.log('You are not sure');
     }
   });
 };
 $scope.endContractProcess=function(endContractBeforeAppoved)
 {
  if(endContractBeforeAppoved==true)
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
                         data: {token:$rootScope.loggedUserId,contract:$stateParams.id,transactions:transactions.val(),endby:'employer'},
                         headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                      }).then(function successCallback(response) {
                        
                        $ionicLoading.show({
                          template: 'Processing...'
                        });
                      
                        if(response.data=="success")
                        {
                         
                          var sendDate=new Date();
                          var myRootRef_a = firebase.database().ref('/contracts/'+$stateParams.id);
                          myRootRef_a.update({endContractBeforeAppoved:"true",endby:"employer",contract_hold_on:sendDate});
                          var new_data=JSON.parse(angular.toJson({message:"Contracted end by employer, talent can apply dispute *",date:sendDate,type:'employer',system_message:"true",status:'unread'}));
                          var myRootRef_proposal_message = firebase.database().ref('/contracts/'+$stateParams.id+"/message");
                          myRootRef_proposal_message.push(new_data);
                          $ionicLoading.hide();
                        }    
                        else
                        {
                           $ionicLoading.hide();
                         
                        }
                      }, function errorCallback(response) {
                        $ionicLoading.hide();
                              
                      });
                  }
                  else
                  {
                     $ionicLoading.hide();
                     alert("Something went wrong. Please try again later or contact support team. Error : transactionsNotFound");
                  }
                }); 
          }
          else
          {
                $ionicLoading.show({
                            template: 'Loading...'
                          });
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
                              myRootRef_a.update({status:"completed",contract_end_on:sendDate});
                              var myRootRef_job = firebase.database().ref('/jobs/'+contract.val().jobid+"/status").set("completed");

                                myRootRef_a.update({endby:"employer"});
                            
                                    var myRootRef_job_get = firebase.database().ref('/jobs/'+contract.val().jobid);
                                  myRootRef_job_get.once('value',function(job){

                                      var myRootRef_timeline = firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/timeline');
                                          var collectionRef_timeline = myRootRef_timeline.push({publishAt:sendDate.toString(),title:'Job Funded.',subTitle:job.val().title,description:job.val().description,type:"jobs",reference:contract.val().jobid,statusline:""});
                                        });
                               

                              var new_data=JSON.parse(angular.toJson({message:"Contract end by employer. Please give a feedback. *",date:sendDate,type:'employer',system_message:"true",status:'unread'}));
                              var myRootRef_proposal_message = firebase.database().ref('/contracts/'+$stateParams.id+"/message");
                              myRootRef_proposal_message.push(new_data);
                                $rootScope.givefeedbackby="employer";
                                $location.path("/app/contractfeedback/"+$stateParams.id); 
                                   }
                                    }, function errorCallback(response) {
                                        console.log("error");
                                        $ionicLoading.hide();
                                  
                                      });
                                    });   
                          }
                        });
            }

 }
 $scope.givefeedback=function()
 {
 	$rootScope.givefeedbackby="employer";
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
$scope.ViewApproveMilestoneWork=function()
{
  for(var key in $scope.contract.milestones)
   {
      if($scope.contract.milestones[key].status=='submitted')
        $location.path('/app/submitmilestone/approve/'+$scope.contractId+'/'+key);
      
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
Analytics.trackPage('Contract_Employer_View');
}
];