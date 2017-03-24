'use strict';
module.exports = [
    '$scope','$ionicModal','$rootScope','$location','Firebase','$ionicPopup','$stateParams','$ionicLoading','$http', function($scope,$ionicModal,$rootScope,$location,Firebase,$ionicPopup,$stateParams,$ionicLoading,$http) {
	$scope.endcontract=[];
	if(!$rootScope.endcontractby)
	{
		$location.path('/app/mainpage');
	}
	$scope.endContract=function()
	{
		
		if($scope.endcontract.reason)
		{
			if($scope.endcontract.communication)
				{
					if($scope.endcontract.understanding)
					{
						if($scope.endcontract.responsibility)
						{
							
							if($scope.endcontract.payment)
							{
								
								if($scope.endcontract.attitude)
								{
									
									if($scope.endcontract.feedback)
										{
											
											$scope.endcontract.avgrating=(parseInt($scope.endcontract.communication)+parseInt($scope.endcontract.understanding)+parseInt($scope.endcontract.responsibility)+parseInt($scope.endcontract.payment)+parseInt($scope.endcontract.attitude))/5;
											
											if($rootScope.endcontractby=="talent" && $stateParams.id)
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
														 	
														 	var feedback={
														 			reason:$scope.endcontract.reason,
														 			feedback:$scope.endcontract.feedback,
														 			attitude:$scope.endcontract.attitude,
														 			payment:$scope.endcontract.payment,
														 			responsibility:$scope.endcontract.responsibility,
														 			understanding:$scope.endcontract.understanding,
														 			communication:$scope.endcontract.communication,
														 			avgrating:$scope.endcontract.avgrating,

														 		};
																var myRootRef_a = firebase.database().ref('/contracts/'+$stateParams.id);
																	if(contract.val().feedbackbyEmployer){
																		myRootRef_a.update({status:"end",feedbackbyTalent:feedback,contract_end_on:sendDate});
																		var myRootRef_job = firebase.database().ref('/jobs/'+contract.val().jobid+"/status").set("end");
																	}
																	else
																	{
																		myRootRef_a.update({endby:"talent",feedbackbyTalent:feedback});
																	}
																	var myRootRef_job_get = firebase.database().ref('/jobs/'+contract.val().jobid);
																	myRootRef_job_get.once('value',function(job){

													     				var myRootRef_timeline = firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/timeline');
            															var collectionRef_timeline = myRootRef_timeline.push({publishAt:sendDate.toString(),title:'Job Completed.',subTitle:job.val().title,description:job.val().description,type:"jobs",reference:contract.val().jobid,statusline:""});
            														});
													     			var myRootRef_user_feedback = firebase.database().ref('/users/'+contract.val().employer_id+"/asEmployerfeedback");
													     			feedback.contract=contract.val();
													     			feedback.contract_id=contract.key;
													     			myRootRef_user_feedback.push(feedback);

																 	var new_data=JSON.parse(angular.toJson({message:"Contract end. *",date:sendDate,type:'talent',system_message:"true"}));
																 	var myRootRef_proposal_message = firebase.database().ref('/contracts/'+$stateParams.id+"/message");
																 	myRootRef_proposal_message.push(new_data);
														           	$location.path("/app/workorganizer");  
																
												           	}
												           	   
													}, function errorCallback(response) {
						                      			console.log("error");
						                      $ionicLoading.hide();
						                      		});
									                    });
													}
												});
											 				
											}
											if($rootScope.endcontractby=="employer" && $stateParams.id)
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
						                       				
															var feedback={
														 			reason:$scope.endcontract.reason,
														 			feedback:$scope.endcontract.feedback,
														 			attitude:$scope.endcontract.attitude,
														 			payment:$scope.endcontract.payment,
														 			responsibility:$scope.endcontract.responsibility,
														 			understanding:$scope.endcontract.understanding,
														 			communication:$scope.endcontract.communication,
														 			avgrating:$scope.endcontract.avgrating,

														 		};
											     			var sendDate=new Date();
															var myRootRef_a = firebase.database().ref('/contracts/'+$stateParams.id);
															if(contract.val().feedbackbyTalent){
																
																			myRootRef_a.update({status:"end",feedbackbyEmployer:feedback,contract_end_on:sendDate});
																			var myRootRef_job = firebase.database().ref('/jobs/'+contract.val().jobid+"/status").set("end");
															}
															else
																myRootRef_a.update({endby:"employer",feedbackbyEmployer:feedback});
											     	
											     					var myRootRef_job_get = firebase.database().ref('/jobs/'+contract.val().jobid);
																	myRootRef_job_get.once('value',function(job){

													     				var myRootRef_timeline = firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/timeline');
            															var collectionRef_timeline = myRootRef_timeline.push({publishAt:sendDate.toString(),title:'Job Funded.',subTitle:job.val().title,description:job.val().description,type:"jobs",reference:contract.val().jobid,statusline:""});
            														});
            														
													     	feedback.contract=contract.val();
											     			feedback.contract_id=contract.key;
											     			var myRootRef_user_feedback = firebase.database().ref('/users/'+contract.val().talent_id+"/asTalentfeedback");
											     			myRootRef_user_feedback.push(feedback);
											     		
														 	var new_data=JSON.parse(angular.toJson({message:"Contact End. *",date:sendDate,type:'employer',system_message:"true"}));
														 	var myRootRef_proposal_message = firebase.database().ref('/contracts/'+$stateParams.id+"/message");
														 	myRootRef_proposal_message.push(new_data);
														 	
												           	$location.path("/app/workorganizer");  
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
										else
										{
											var alertPopup = $ionicPopup.alert({
										     title: 'Worklidate',
										     template: "Please fill feedback."
										   });
										}
								}
								else
								{
									var alertPopup = $ionicPopup.alert({
								     title: 'Worklidate',
								     template: "Please give 'Attitude' rating"
								   });
								}
							}
							else
							{
								var alertPopup = $ionicPopup.alert({
							     title: 'Worklidate',
							     template: "Please give 'Payment' rating"
							   });
							}
						}
						else
						{
							var alertPopup = $ionicPopup.alert({
						     title: 'Worklidate',
						     template: "Please give 'Responsibility' rating"
						   });
						}
					}
					else
					{
						var alertPopup = $ionicPopup.alert({
					     title: 'Worklidate',
					     template: "Please give 'Understanding' rating"
					   });
					}
				}
				else
				{
					var alertPopup = $ionicPopup.alert({
				     title: 'Worklidate',
				     template: "Please give 'Communication' rating"
				   });
				}
		}
		else
		{
			 var alertPopup = $ionicPopup.alert({
			     title: 'Worklidate',
			     template: 'Please select reason of end contract'
			   });
		}
	}
}
];