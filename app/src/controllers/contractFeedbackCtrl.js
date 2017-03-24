
'use strict';
module.exports = [
    '$scope','$ionicModal','$rootScope','$location','Firebase','Analytics','$ionicPopup','$stateParams','$ionicLoading', function($scope,$ionicModal,$rootScope,$location,Firebase,Analytics,$ionicPopup,$stateParams,$ionicLoading) {
	$scope.endcontract=[];
	$rootScope.checkLogin();
	if(!$rootScope.givefeedbackby)
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
											if($rootScope.givefeedbackby=="talent" && $stateParams.id)
											{

												var myRootRef_check = firebase.database().ref('/contracts/'+$stateParams.id);
												myRootRef_check.once('value',function(contract){
													if(contract.val())
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
															var myRootRef_a = firebase.database().ref('/contracts/'+$stateParams.id);
															var sendDate=new Date();
															if(contract.val().feedbackbyEmployer){
																		myRootRef_a.update({status:"end",feedbackbyTalent:feedback,contract_end_on:sendDate});
																		var myRootRef_job = firebase.database().ref('/jobs/'+contract.val().jobid+"/status").set("end");
																	}
																	else
																		myRootRef_a.update({status:"completed",feedbackbyTalent:feedback});
															
															var myRootRef_job_get = firebase.database().ref('/jobs/'+contract.val().jobid);
																	myRootRef_job_get.once('value',function(job){

													     				var myRootRef_timeline = firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/timeline');
            															var collectionRef_timeline = myRootRef_timeline.push({publishAt:sendDate.toString(),title:'Job Completed.',subTitle:job.val().title,description:job.val().description,type:"jobs",reference:contract.val().jobid,statusline:""});
            														});

															feedback.contract=contract.val();
											     			feedback.contract_id=contract.key;
															var myRootRef_user_feedback = firebase.database().ref('/users/'+contract.val().employer_id+"/asEmployerfeedback");
											     			myRootRef_user_feedback.push(feedback);
												           	$location.path("/app/workorganizer");     
													}
												});
											 				
											}
											if($rootScope.givefeedbackby=="employer" && $stateParams.id)
											{

												var myRootRef_check = firebase.database().ref('/contracts/'+$stateParams.id);
												myRootRef_check.once('value',function(contract){
													if(contract.val())
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
																myRootRef_a.update({status:"completed",feedbackbyEmployer:feedback});

															var myRootRef_job_get = firebase.database().ref('/jobs/'+contract.val().jobid);
																	myRootRef_job_get.once('value',function(job){

													     				var myRootRef_timeline = firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/timeline');
            															var collectionRef_timeline = myRootRef_timeline.push({publishAt:sendDate.toString(),title:'Job Funded.',subTitle:job.val().title,description:job.val().description,type:"jobs",reference:contract.val().jobid,statusline:""});
            														});
															feedback.contract=contract.val();
											     			feedback.contract_id=contract.key;
											     			var myRootRef_user_feedback = firebase.database().ref('/users/'+contract.val().talent_id+"/asTalentfeedback");
											     			myRootRef_user_feedback.push(feedback);
												           	$location.path("/app/workorganizer");     
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
	Analytics.trackPage('Contract_Feedback');
}
];