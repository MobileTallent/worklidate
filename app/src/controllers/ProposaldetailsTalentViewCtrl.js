'use strict';
module.exports = [
    '$scope','$ionicModal','$location','$rootScope','Firebase','$http','$ionicPopup','$stateParams','$ionicLoading','$ionicActionSheet','Analytics', function($scope,$ionicModal,$location,$rootScope,Firebase,$http,$ionicPopup,$stateParams,$ionicLoading,$ionicActionSheet,Analytics) {
 $scope.proposalId=$stateParams.id;
$rootScope.checkLogin();
if($stateParams.id)
 {
  $ionicLoading.show({
      template: 'Loading...'
    });
 			var myRootRef_a = firebase.database().ref('/jobproposals/'+$stateParams.id);
	            myRootRef_a.on("value", function(proposal) {
	            	//$ionicLoading.hide();
	            	$scope.proposal=proposal.val();
	          if(proposal.val())
	          {
	            	

	            	var myRootRef_job = firebase.database().ref('/jobs/'+$scope.proposal.jobid);
			            myRootRef_job.on("value", function(job) {
			            	$scope.job=job.val();
			            	if($scope.job)
			            	{
			            	var myRootRef_user = firebase.database().ref('/users/'+$scope.job.userid);
				            myRootRef_user.on("value", function(employer) {
				            	$ionicLoading.hide();
				            	$scope.employer=employer.val();
				            	setTimeout(function(){
							 		var objDiv = document.getElementById("job-details-message-list"+$scope.proposalId);
									objDiv.scrollTop = objDiv.scrollHeight;
								},1000);
				            });
			            	}
			            	else
			            	{
			            		var Backlen=history.length;   
											 history.go(-Backlen); 
											            
			            		 //window.location.replace("#/app/workorganizer");
			            			
			            	}
			            });
			        }
			        else
			        {
                var proposalid_contractid=firebase.database().ref('/proposalid_contractid').orderByChild('proposalid').equalTo($scope.proposalId);
                proposalid_contractid.once("value", function(proposals) {
                if(proposals.val())
                  {
                    for(var key in proposals.val())
                                {
                                   $ionicLoading.hide();
                                 var alertPopup = $ionicPopup.alert({
                                           title: 'Contract Started.',
                                           template: 'This contract is start by client. You will redirect to contract screen.'
                                         });
                                  alertPopup.then(function(res) {
                                    var Backlen=history.length;   
                                   history.go(-Backlen); 
                                   window.location.replace("#/app/contract/details/"+proposals.val()[key].contractid);
                                    $rootScope.reloadContractPage=true;    
                                    });
                                            
                                   

                                }
                   
                  }
                  else
                  {
                    var Backlen=history.length;   
                    history.go(-Backlen); 
                     window.location.replace("#/app/mainpage");
                    $ionicLoading.hide();
                  }
                })

			        	
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
	 	var myRootRef_proposal_message = firebase.database().ref('/jobproposals/'+$stateParams.id+"/message");
	 	myRootRef_proposal_message.push(new_data);
	 	var notification_data=JSON.parse(angular.toJson({date:sendDate,message:$rootScope.userdata.name+'(Talent) sent you a message on proposal of "'+$scope.job.title+'"',type:'contractmessage',sender:$rootScope.loggedUserId,senderName:$rootScope.userdata.name,status:'unread'}));
    	var ref = firebase.database().ref('/notification/'+$scope.proposal.employer_id);
    	ref.push(notification_data);
	 	$scope.proposalchat.message="";
	 	var objDiv = document.getElementById("job-details-message-list"+$scope.proposalId);
		objDiv.scrollTop = objDiv.scrollHeight;
	 }
  }
  $scope.acceptproposal=function()
  {
  		var myRootRef_acceptedbyemployer = firebase.database().ref('/jobproposals/'+$stateParams.id+"/acceptedbytalent");
	 	myRootRef_acceptedbyemployer.set("1");
	 	var sendDate=new Date();
	 	var new_data=JSON.parse(angular.toJson({message:"Proposal accepted.  *",date:sendDate,type:'talent',system_message:"true",status:'unread'}));
	 	var myRootRef_proposal_message = firebase.database().ref('/jobproposals/'+$stateParams.id+"/message");
	 	myRootRef_proposal_message.push(new_data);
	 	var notification_data=JSON.parse(angular.toJson({date:sendDate,message:$rootScope.userdata.name+'(Talent) accepted the proposal of "'+$scope.job.title+'"',type:'contractmessage',sender:$rootScope.loggedUserId,senderName:$rootScope.userdata.name,status:'unread'}));
    	var ref = firebase.database().ref('/notification/'+$scope.proposal.employer_id);
    	ref.push(notification_data);
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
Analytics.trackPage('Proposal_Details_Talent_View');
}
];