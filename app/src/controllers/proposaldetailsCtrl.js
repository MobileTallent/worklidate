'use strict';
module.exports = [
    '$scope','$ionicModal','$rootScope','Firebase','$location','$ionicPopup','$stateParams','$timeout','$ionicLoading','$ionicActionSheet','$http','Analytics', function($scope,$ionicModal,$rootScope,Firebase,$location,$ionicPopup,$stateParams,$timeout,$ionicLoading,$ionicActionSheet,$http,Analytics) {
 $scope.proposalId=$stateParams.id;
 $rootScope.checkLogin();
 $scope.milestones_percentage=0;
if($stateParams.id)
 {
  $ionicLoading.show({
      template: 'Loading...'
    });
 			var myRootRef_a = firebase.database().ref('/jobproposals/'+$stateParams.id);
	            myRootRef_a.on("value", function(proposal) {
                  $scope.proposal=proposal.val();
	            if(proposal.val())
	          {
               $scope.milestones_percentage=0;
	            
	            	if($scope.proposal && $scope.proposal!=null)
	            	{
	            	var myRootRef_job = firebase.database().ref('/jobs/'+$scope.proposal.jobid);
			            myRootRef_job.on("value", function(job) {
                    if(job.val() && $scope.proposal && $scope.proposal!=null)
                    {
			            	$scope.job=job.val();

			            	var myRootRef_user = firebase.database().ref('/users/'+$scope.proposal.talent_id);
				            myRootRef_user.on("value", function(talent) {
				            	$ionicLoading.hide();
				            	$scope.talent=talent.val();

                  setTimeout(function(){
                  var objDiv = document.getElementById("job-details-message-list"+$scope.proposalId);
                  objDiv.scrollTop = objDiv.scrollHeight;
                },1000);

				            });
			            	}
			            });
                  for(var key in $scope.proposal.milestones)
                  {
                    $scope.lastMileStoneKey=key;
                    $scope.milestones_percentage=parseFloat($scope.milestones_percentage)+parseFloat($scope.proposal.milestones[key].budget);
                  }
			        }
			        else
			        {
                var Backlen=history.length;   
                history.go(-Backlen); 
                                  
			       // window.location.replace("#/app/workorganizer");
			        }
			    }
			    else
			    {
            var Backlen=history.length;   
            history.go(-Backlen); 
                                  
			    	//window.location.replace("#/app/workorganizer");
			    	$ionicLoading.hide();
			    }
	            });
	            
 }


 $scope.proposalchat=[];
 $scope.sendMessage=function()
 {

	if($scope.proposalchat.message)
	{
	 	var sendDate=new Date();
	 	var new_data=JSON.parse(angular.toJson({message:$scope.proposalchat.message,date:sendDate,type:'employer',status:'unread'}));
	 	var myRootRef_proposal_message = firebase.database().ref('/jobproposals/'+$stateParams.id+"/message");
	 	myRootRef_proposal_message.push(new_data);
	 	$scope.proposalchat.message="";
    var notification_data=JSON.parse(angular.toJson({date:sendDate,message:$rootScope.userdata.name+'(Employer) sent you a message on proposal of "'+$scope.job.title+'"',type:'contractmessage',sender:$rootScope.loggedUserId,senderName:$rootScope.userdata.name,status:'unread'}));
    var ref = firebase.database().ref('/notification/'+$scope.proposal.talent_id);
    ref.push(notification_data);
    var objDiv = document.getElementById("job-details-message-list"+$scope.proposalId);
    objDiv.scrollTop = objDiv.scrollHeight;
	 }
  }
  $scope.acceptproposal=function()
  {
      $scope.milestones_percentage=0;
   for(var key in $scope.proposal.milestones)
        {
      $scope.milestones_percentage=parseFloat($scope.milestones_percentage)+parseFloat($scope.proposal.milestones[key].budget);

      
    }

    $timeout(function(){ 
    if($scope.milestones_percentage==$scope.proposal.budget)
     {
      
  	    var myRootRef_acceptedbyemployer = firebase.database().ref('/jobproposals/'+$stateParams.id+"/acceptedbyemployer");
     
	 	myRootRef_acceptedbyemployer.set("1");
	 	var sendDate=new Date();
		 	var new_data=JSON.parse(angular.toJson({message:"Proposal accepted  *",date:sendDate,type:'employer',system_message:"true",status:'unread'}));
		 	var myRootRef_proposal_message = firebase.database().ref('/jobproposals/'+$stateParams.id+"/message");
		 	myRootRef_proposal_message.push(new_data);
     var notification_data=JSON.parse(angular.toJson({date:sendDate,message:$rootScope.userdata.name+'(Employer) accepted proposal of "'+$scope.job.title+'"',type:'contractmessage',sender:$rootScope.loggedUserId,senderName:$rootScope.userdata.name,status:'unread'}));
    var ref = firebase.database().ref('/notification/'+$scope.proposal.talent_id);
    ref.push(notification_data);
    
     } 
     else
     {
     var alertPopup = $ionicPopup.alert({
           title: 'Milestones',
           template:"Job budget is "+$scope.proposal.budget+". Your milestone budget amount total is "+$scope.milestones_percentage+". Please check your milestone budget and try again."
         });
      }  
	 	 },1000);
  }
  $scope.$watch('newMilestoneData.budget', function(newValue, oldValue) {
  // access new and old value here
  if(oldValue && newValue)
  {
    var t=newValue;
  if(parseFloat($scope.milestones_percentage)+parseFloat(t)<=$scope.proposal.budget)
    $scope.newMilestoneData.budget=newValue;
  else
    $scope.newMilestoneData.budget=oldValue;
  }
});
  $scope.changeBid=function(amount,oldamount,currency)
  {
  	$ionicLoading.show({
      template: 'Loading...'
    });

  	var myRootRef_amount = firebase.database().ref('/jobproposals/'+$stateParams.id+"/budget");
  	myRootRef_amount.set(amount);
  	var myRootRef_acceptedbyemployer = firebase.database().ref('/jobproposals/'+$stateParams.id).update({acceptedbyemployer:0,acceptedbytalent:0});
	 
  	var sendDate=new Date();
	 	var new_data=JSON.parse(angular.toJson({message:"Changed budget from "+currency+" "+oldamount+" to "+currency+" "+amount+" *",date:sendDate,type:'employer',system_message:"true",status:'unread'}));
	 	var myRootRef_proposal_message = firebase.database().ref('/jobproposals/'+$stateParams.id+"/message");
	 	myRootRef_proposal_message.push(new_data);
  	$ionicLoading.hide();
    $scope.reCalculateMilestone(amount);
  
  }
  $scope.reCalculateMilestone=function(budget)
 {
    for(var key in $scope.proposal.milestones)
      {
         var progress=($scope.proposal.milestones[key].budget*100)/budget;
         var myRootRef_update_milestone = firebase.database().ref('/jobproposals/'+$stateParams.id+"/milestones/"+key);
         myRootRef_update_milestone.update({progress:progress});
      }
 }
  $scope.deleteMilestone=function(id,milestoneTitle,progress,milestone_budget)
  {
  	  var myRootRef_delete = firebase.database().ref('/jobproposals/'+$stateParams.id+"/milestones/"+id);
  		myRootRef_delete.remove();
  		var sendDate=new Date();
		 	var new_data=JSON.parse(angular.toJson({message:"milestone deleted' "+milestoneTitle+"' *",date:sendDate,type:'employer',system_message:"true",status:'unread'}));
		 	var myRootRef_proposal_message = firebase.database().ref('/jobproposals/'+$stateParams.id+"/message");
		 	myRootRef_proposal_message.push(new_data);

  		var myRootRef_acceptedbyemployer = firebase.database().ref('/jobproposals/'+$stateParams.id).update({acceptedbyemployer:0,acceptedbytalent:0});
  			$scope.milestones_percentage= $scope.milestones_percentage-milestone_budget;
        
	
  }
  $scope.savemilestone=function(data,milestoneid,milestoneTitle,oldbudget,oldprogress)
  {
  	if(data)
  	{
  		
    var progress=(data.budget*100)/$scope.proposal.budget;

    
    if((parseInt($scope.milestones_percentage-oldbudget)+parseInt(data.budget))<=$scope.proposal.budget)
    {
    
       $scope.milestones_percentage=(parseFloat($scope.milestones_percentage)+parseFloat(progress))-oldprogress;
      
      $ionicLoading.show({
      template: 'Loading...'
    });
  			var myRootRef_update_milestone = firebase.database().ref('/jobproposals/'+$stateParams.id+"/milestones/"+milestoneid);
  			myRootRef_update_milestone.update({deliveryTime:data.deliveryTime,details:data.details,progress:progress,budget:data.budget});

  			var sendDate=new Date();
		 	var new_data=JSON.parse(angular.toJson({message:"Changed milestone ' *"+milestoneTitle+"'",date:sendDate,type:'employer',system_message:"true",status:'unread'}));
		 	var myRootRef_proposal_message = firebase.database().ref('/jobproposals/'+$stateParams.id+"/message");
		 	myRootRef_proposal_message.push(new_data);
		 	var myRootRef_acceptedbyemployer = firebase.database().ref('/jobproposals/'+$stateParams.id).update({acceptedbyemployer:0,acceptedbytalent:0});
  			$ionicLoading.hide();
         if(!$scope.$$phase) {
                  $scope.$apply();
                  
                  }
      }
      else
      {
         var alertPopup = $ionicPopup.alert({
           title: 'Milestones',
           template:'Milestone progress is not 100%.'
         });
      }
  	}

  }
  $scope.addNewMilestone=function()
 {
	$(".newMilestone").css('display','block');
  var objDiv = document.getElementById("scroll-content-proposal");
objDiv.scrollTop = objDiv.scrollHeight;
 }
 $scope.cancelMilestone=function()
 {
	$(".newMilestone").css('display','none');
 }
 $scope.newMilestoneData=[];
 $scope.createMilestone=function()
 {
 	if($scope.newMilestoneData.title && $scope.newMilestoneData.details && $scope.newMilestoneData.budget && $scope.newMilestoneData.deliveryTime)
 	{

    $scope.newMilestoneData.progress=$scope.newMilestoneData.budget*100/$scope.proposal.budget;
    $scope.milestones_percentage=parseFloat($scope.milestones_percentage)+parseFloat($scope.newMilestoneData.budget);
 		var myRootRef_add_milestone = firebase.database().ref('/jobproposals/'+$stateParams.id+"/milestones/"+(parseInt($scope.lastMileStoneKey)+1));
  			myRootRef_add_milestone.set({title:$scope.newMilestoneData.title,deliveryTime:$scope.newMilestoneData.deliveryTime,details:$scope.newMilestoneData.details,progress:$scope.newMilestoneData.progress,budget:$scope.newMilestoneData.budget});

  			var sendDate=new Date();
		 	var myRootRef_acceptedbyemployer = firebase.database().ref('/jobproposals/'+$stateParams.id).update({acceptedbyemployer:0,acceptedbytalent:0});
		 	var new_data=JSON.parse(angular.toJson({message:"Added new milestone '"+$scope.newMilestoneData.title+"' *",date:sendDate,type:'employer',system_message:"true",status:'unread'}));
		 	var myRootRef_proposal_message = firebase.database().ref('/jobproposals/'+$stateParams.id+"/message");

      myRootRef_proposal_message.push(new_data);
	 		$(".newMilestone").css('display','none');
      setTimeout(function(){
	 		$scope.newMilestoneData=[];
    },1);
 	}
 }

 
 // A confirm dialog
 $scope.confirmProposal = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Start Contract',
     template: 'Are you sure you want to start the contract?'
   });

   confirmPopup.then(function(res) {
     if(res) {
      if($scope.proposal.acceptedbyemployer=="1" && $scope.proposal.acceptedbytalent=="1")
	 	{
	 			if($scope.milestones_percentage==$scope.proposal.budget)
				$location.path("/app/milestonespayment/"+$stateParams.id+'/first');
      else
       var alertPopup = $ionicPopup.alert({
           title: 'Milestones',
           template:"Job budget is "+$scope.proposal.budget+". Your milestone budget amount total is "+$scope.milestones_percentage+". Please check your milestone budget and try again."
         });
	           	
	 	}
     } else {
       console.log('You are not sure');
     }
   });
 };
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

Analytics.trackPage('Proposal_Details_Employer_View');
}
];