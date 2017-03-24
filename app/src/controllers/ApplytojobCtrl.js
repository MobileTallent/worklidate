'use strict';
module.exports = [
    '$scope','$stateParams','$rootScope','$location','Analytics','$filter','$ionicLoading','$firebaseObject','$ionicPopup','$timeout',
 function($scope,$stateParams,$rootScope,$location,Analytics,$filter,$ionicLoading,$firebaseObject,$ionicPopup,$timeout) {
$rootScope.checkLogin();
$scope.milestones_percentage=0;
$scope.jid=$stateParams.id;
 if($stateParams.id)
 {
  $ionicLoading.show({
      template: 'Loading...'
    });
 			var myRootRef_a = firebase.database().ref('/jobs/'+$stateParams.id);
	            myRootRef_a.once("value", function(job) {
	            	$scope.job=job.val();
	            });
	            if(!$rootScope.user_projects)
	            {
	            	 if(window.localStorage.getItem('info'))
        			{
    				var ref = firebase.database().ref("/projects");
    		        ref.orderByChild('userid').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).on("value", function(projects) {
    		        $rootScope.user_projects=[];
    		        for(var key in projects.val())
    		        {
    		            var d=projects.val()[key];
    		            d.id=key;
    		            $rootScope.user_projects.push(d);
    		        }
    		 
    		          $ionicLoading.hide();
    		        }, function (errorObject) {
    		          console.log("The read failed: " + errorObject.code);
    		          $ionicLoading.hide();
    		        });
    		    }
	           	}else
	           	{
	           		 $ionicLoading.hide();
	           	}
 }
 $scope.project=[];
$scope.showProject=function(id)
{
	if(id)
	{
		var ref = firebase.database().ref('/projects/'+id);
		$scope.project=$firebaseObject(ref);
	}
}
$scope.jobproposal=[];
 $scope.newMilestoneData=[];
 $scope.milestones=[];
 $scope.addNewMilestone=function()
 {
	$(".newMilestone").css('display','block');
	var objDiv = document.getElementById("scroll-content-applyjob");
objDiv.scrollTop = objDiv.scrollHeight;
 }
 $scope.cancelMilestone=function()
 {
	$(".newMilestone").css('display','none');
 }
$scope.$watch('newMilestoneData.budget', function(newValue, oldValue) {
  // access new and old value here
  if(oldValue && newValue)
  {
  	var t=newValue;
 	if(parseFloat($scope.milestones_percentage)+parseFloat(t)<=$scope.jobproposal.budget)
 		$scope.newMilestoneData.budget=newValue;
 	else
 		$scope.newMilestoneData.budget=oldValue;
  }
 
});
 $scope.createMilestone=function()
 {
 	if($scope.newMilestoneData.title && $scope.newMilestoneData.details && $scope.newMilestoneData.budget && $scope.newMilestoneData.deliveryTime)
 	{
 		$scope.newMilestoneData.progress=($scope.newMilestoneData.budget*100)/$scope.jobproposal.budget;
 		$scope.milestones_percentage=parseFloat($scope.milestones_percentage)+$scope.newMilestoneData.budget;
 		$scope.milestones.push($scope.newMilestoneData);
 		$(".newMilestone").css('display','none');
 		$scope.newMilestoneData=[];
 		$scope.newMilestoneData.budget='';
 	}
 }
 $scope.deleteMilestone=function(index)
 {
 	$scope.milestones_percentage=$scope.milestones_percentage-$scope.milestones[index].budget;
 	$scope.milestones.splice(index,1);
 	
 }
 $scope.reCalculateMilestone=function(budget)
 {
 
 	$scope.milestones_percentage=0;
 	$scope.milestones.forEach(function(entry,index){
 		$scope.milestones[index].progress=($scope.milestones[index].budget*100)/budget;
 		$scope.milestones_percentage=parseFloat($scope.milestones_percentage)+parseFloat($scope.milestones[index].budget);

 		
 	});
 }
 $scope.submitProposal=function()
 {
 	
	$scope.milestones_percentage=0;
 	$scope.milestones.forEach(function(entry,index){
 		
 		$scope.milestones_percentage=parseFloat($scope.milestones_percentage)+parseFloat($scope.milestones[index].budget);

 		
 	});
 	$ionicLoading.show({
				      template: 'Applying...'
				    });
$timeout(function(){ 
 if($stateParams.id)
 {
 	
 if($scope.jobproposal.description)
 	{
 		if($scope.milestones.length>0)
 		{
 		if($scope.milestones_percentage==$scope.jobproposal.budget)
 		{
				$scope.valid=true;
				 if($scope.job.screeningQuestions && $scope.jobproposal.screeningQuestionsAnswer){
				 	
					  for(var key in $scope.job.screeningQuestions){
					  	if(!$scope.jobproposal.screeningQuestionsAnswer[key])
					  	{
					  				$scope.jobproposal.screeningQuestionsAnswerError=[];
					  		  		$scope.jobproposal.screeningQuestionsAnswerError[key]="Answer this question to apply";
					  		  		$scope.valid=false;
					  		  		$ionicLoading.hide();
					 	}

					 };
					 }

				  else if($scope.job.screeningQuestions && !$scope.jobproposal.screeningQuestionsAnswer)
					{
						$ionicLoading.hide();
						$scope.valid=false;
						var alertPopup = $ionicPopup.alert({
						     title: 'Required',
						     template:"Please fill all the answers of questions."
						   });
							
					}
					else
					{

					}
 		 	
					 setTimeout(function(){

					 
					 	if($scope.valid==true)
					 	{
					
						$scope.jobproposal.publishAt=new Date();
					 		var u_data=$scope.jobproposal;
							u_data.publishAt=$scope.job.publishAt.toString();
							u_data.employer_id=$scope.job.userid;
							u_data.talent_id=JSON.parse(window.localStorage.getItem('info')).uid;
							u_data.jobid=$stateParams.id;
							u_data.currency=$scope.job.currency;
							u_data.status='open';
							u_data.milestones=[];
							if($scope.milestones.length>0)
							{
								$scope.milestones.forEach(function(entry,index){
									
									u_data.milestones.push({progress: entry.progress, deliveryTime: entry.deliveryTime, title: entry.title, details: entry.details,budget: entry.budget});
									if($scope.milestones.length==(index+1))
									{
										
										var addJobProposal = firebase.database().ref('/jobproposals');
										var addJobProposalRef = addJobProposal.push(u_data);
										$scope.milestones=[];
										$scope.jobproposal=[];
										$ionicLoading.hide();

										 	var sendDate=new Date();
										 	
										 	var new_data=JSON.parse(angular.toJson({message:'New proposal received',date:sendDate,type:'talent',status:'unread',hide:'true',jobid:$stateParams.id}));
										 	var myRootRef_proposal_message = firebase.database().ref('/jobproposals/'+addJobProposalRef.key+"/message");
										 	myRootRef_proposal_message.push(new_data);
										 	var notification_data=JSON.parse(angular.toJson({date:sendDate,message:'New proposal received from '+$rootScope.userdata.name+' for "'+$scope.job.title+'" job',type:'contractmessage',sender:$rootScope.loggedUserId,senderName:$rootScope.userdata.name,status:'unread',jobid:$stateParams.id,newProposal:true}));
									    	var ref = firebase.database().ref('/notification/'+$scope.job.userid);
									    	ref.push(notification_data);
										 
										 var alertPopup = $ionicPopup.alert({
                                           title: 'Sent',
                                           template: 'Job proposal submitted successfully.'
                                         });
		                                  alertPopup.then(function(res) {
		                                   $location.path('/app/mainpage');
		                                    });

										
										
									}
								});
							}
							else{
							
								var addJobProposal = firebase.database().ref('/jobproposals');
								var addJobProposalRef = addJobProposal.push(u_data);
								$scope.milestones=[];
										$scope.jobproposal=[];
										$ionicLoading.hide();
										alert("Job proposal submitted successfully.");
										$location.path('/app/mainpage');
							}

							setTimeout(function(){
								var myRootRef_push_applied = firebase.database().ref('/jobs/'+$stateParams.id+'/proposals');
								myRootRef_push_applied.push({userid:JSON.parse(window.localStorage.getItem('info')).uid});
							},100);
						
						}
						else
						  {
						  $ionicLoading.hide();
						  }
					 },2000);
				  
		}
		else
		{
			var alertPopup = $ionicPopup.alert({
			     title: 'Milestones',
			     template:"Job budget is "+$scope.jobproposal.budget+". Your milestone budget amount total is "+$scope.milestones_percentage+". Please check your milestone budget and try again."
			   });

			
			$ionicLoading.hide();
		}
	}
	else
	{
		alert("Please create milestone.");
		$ionicLoading.hide();
	}	 	
 	}
 	else
 	{
 		alert("Write your proposal to apply for job.");
 		$ionicLoading.hide();
 	}
 }
 },1000);
 }
 Analytics.trackPage('Send_Job_Proposal');
}
];