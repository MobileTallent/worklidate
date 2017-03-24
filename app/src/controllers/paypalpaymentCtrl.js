'use strict';
module.exports = [
    '$scope',function($scope,$ionicModal,$rootScope,Firebase,$ionicPopup,$stateParams,$ionicLoading,$location,$http,$timeout,Analytics) {
 $rootScope.checkLogin();
 $scope.jobid=0;
  $scope.payPalTransationResponce=[];

 if($stateParams.id)
 {
 	var myRootRef_trans = firebase.database().ref('/paypalPaymentData/'+$stateParams.id);
	myRootRef_trans.once("value", function(trans) {
		
		$scope.payPalTransationResponce=trans.val().paypal;
	 if(trans.val().data.proposalid && trans.val().data.type=='firstpayment')
	 {
	 	$scope.proposalid=trans.val().data.proposalid;
	 	setTimeout(function(){
	 				$scope.firstpayment();
	 			},100);
		 
		 	
		            
	 }
	  if(trans.val().data.contractId && trans.val().data.type=='nextMilestonePayment')
	 {
	 	
	 	$scope.contractId=trans.val().data.contractId;
	 	setTimeout(function(){
	 				$scope.nextMilestonePayment();
	 			},100);
		 
		            
	 }
	 if(trans.val().data.contractId && trans.val().data.milestoneid && trans.val().data.type=='bonus')
	 {
	 	
		 	
		         $scope.contractId=trans.val().data.contractId;
	 			$scope.milestoneId=trans.val().data.milestoneid;
	 			setTimeout(function(){
	 				$scope.bonuspayment();
	 			},100);
	 }
	 
	  });
}
$scope.nextMilestonePaymentProccess=function(payType)
{
	$ionicLoading.show({ template: 'Proccessing...'});
	if(!$scope.milestone.status && $scope.milestoneId && $scope.contractId)
	{
		$http({
		                      method: 'POST',
		                      url: window.location.origin+'/transaction.php',
		                       data: {token:$rootScope.loggedUserId,type:'milestone_payment',domain:window.location.origin,milestone:$scope.milestoneId,contract:$scope.contractId,job:$scope.contract.jobid,payType:payType,payPalTransationResponce:$scope.payPalTransationResponce},
		                       headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		                    }).then(function successCallback(response) {
	                       			
	                       // var date = new Date(response.data+' UTC');
							//console.log(date.toString());
	                      
			                       if(response.data=="success")
			                     	{
						 			 		var myRootRef_submit = firebase.database().ref('/contracts/'+$scope.contractId+"/milestones/"+$scope.milestoneId+"/status").set("working");
											var sendDate=new Date();
									 		 	var new_data=JSON.parse(angular.toJson({message:"'"+$scope.milestone.title+"' Milestone assigned *",date:sendDate,type:'employer',subtype:"milestone_assign",system_message:"true",status:'unread'}));
									 		 	var myRootRef_proposal_message = firebase.database().ref('/contracts/'+$scope.contractId+"/message");
									 		 	myRootRef_proposal_message.push(new_data);
									 		 	$ionicLoading.hide();
									 		 	$location.path('/app/contract/details/emp/'+$scope.contractId);
									}
			 			 				}, function errorCallback(response) {
                      			console.log(response);
                      			$ionicLoading.hide();
                      
                      		});

		
	}
}
$scope.nextMilestonePayment=function()
{

	 	
	  $ionicLoading.show({
	      template: 'Loading...'
	    });
 			var myRootRef_a = firebase.database().ref('/contracts/'+$scope.contractId);
	            myRootRef_a.once("value", function(contract) {
	            	if(contract.val())
	            	{
	            	$scope.contract=contract.val();
	            	for(var key in $scope.contract.milestones)
	            	{
	            		if(!$scope.contract.milestones[key].status && !$scope.milestone)
	            		{
	            			$scope.milestone=$scope.contract.milestones[key];
	            			$scope.milestoneId=key;
	            		}
	            	}
	            	setTimeout(function(){
			            	if($scope.milestone)
			            	{
			            		if(!$scope.milestone.status)
			            		{
			            			
			            			var myRootRef_job = firebase.database().ref('/jobs/'+$scope.contract.jobid);
						            myRootRef_job.once("value", function(job) {
						            	$scope.job=job.val();
						            	$scope.nextMilestonePaymentProccess('paypal');
						            });
			            		}
			            		else
			            		{
			            			$location.path('/app/mainpage');
			            		}
			            	}
			            	else
			            	{
			            		$location.path('/app/mainpage');
			            	}
		            	},2000);

	            	
			         }
			         else
			         {
			         	$location.path('/app/mainpage');
			         		$ionicLoading.hide();
			         }
	            
	            });
}

$scope.bonuspayment=function()
{

	  $ionicLoading.show({
	      template: 'Loading...'
	    });
 			var myRootRef_a = firebase.database().ref('/contracts/'+$scope.contractId);
	            myRootRef_a.once("value", function(contract) {
	            	$scope.contract=contract.val();
	            	$scope.milestone=$scope.contract.milestones[$scope.milestoneId];
	            	if($scope.milestone)
	            	{
	            		if($scope.milestone.status=="submitted")
	            		{
	            			
	            			var myRootRef_job = firebase.database().ref('/jobs/'+$scope.contract.jobid);
			           		 myRootRef_job.once("value", function(job) {
			            	$scope.job=job.val();
			            	$scope.payBonusProccess('paypal',$scope.payPalTransationResponce);

			            });
			        
	            		}
	            		else
	            		{
	            			$location.path('/app/mainpage');
	            		}
	            	}
	            	else
	            	{
	            		$location.path('/app/mainpage');
	            	}
			         
	            	$ionicLoading.hide();
	            });
}
$scope.payBonusProccess=function(payType,data)
 {
 	//alert(data.transactions[0].amount.total);
 	$ionicLoading.show({
      template: 'Proccessing...'
    });
 	$http({
                  method: 'POST',
                  url: window.location.origin+'/transaction.php',
                   data: {token:$rootScope.loggedUserId,type:'bonus',domain:window.location.origin,milestone:$scope.milestoneId,contract:$scope.contractId,job:$scope.contract.jobid,amount:data.transactions[0].amount.total,payType:payType,payPalTransationResponce:$scope.payPalTransationResponce},
                   headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then(function successCallback(response) {
               		
               			$ionicLoading.show({
								      template: 'Proccessing...'
								    });
				if(response.data=="success")
				{
				 	 		$ionicLoading.show({
															      template: 'Proccessing...'
															    });
				 	var transactions_id=null;
		 	 		var ref1 = firebase.database().ref("/transactions/").orderByChild('contractid').equalTo($scope.contractId);
			        ref1.once("value", function(snapshot) {
	        		for(var key in snapshot.val())
	        		if(snapshot.val()[key].milestoneid==$scope.milestoneId && snapshot.val()[key].payment_status=='escrow')
	        			transactions_id=key;
	        			var milestone_amount=snapshot.val()[key].amount;
	        		setTimeout(function(){
	        			if(transactions_id!=null)
	        			{
	        				$ionicLoading.show({
								      template: 'Proccessing...'
								    });
	        				$http({
		                      method: 'POST',
		                      url: window.location.origin+'/transaction.php',
		                       data: {token:$rootScope.loggedUserId,type:'milestone_approved',domain:window.location.origin,milestone:$scope.milestoneId,contract:$scope.contractId,job:$scope.contract.jobid,transactionsId:transactions_id},
		                       headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		                    }).then(function successCallback(response) {
		                    	$ionicLoading.show({
								      template: 'Proccessing...'
								    });
	                       			
	                       			//$ionicLoading.hide();
	                       // var date = new Date(response.data+' UTC');
							//console.log(date.toString());
	                      
			                       if(response.data=="success")
			                     	{
										 		$ionicLoading.show({
															      template: 'Proccessing...'
															    });
				 	 					var sendDate=new Date();
							 	 		var myRootRef_submit = firebase.database().ref('/contracts/'+$scope.contractId+"/milestones/"+$scope.milestoneId).update({status:"approved",approved_on:sendDate});
							 	 		var myRootRef_assign_new = firebase.database().ref('/contracts/'+$scope.contractId+"/assigned_milestone").set("false");
							 		 	
							 		 	var new_data=JSON.parse(angular.toJson({message:"Milestone approved. Paid "+$scope.contract.currency+" "+milestone_amount+" and bonus "+$scope.contract.currency+" "+data.transactions[0].amount.total+". *",date:sendDate,type:'employer',subtype:"milestone_approved",data:"/"+$scope.contractId+"/"+$scope.milestoneId,system_message:"true",status:'unread'}));
							 		 	var myRootRef_proposal_message = firebase.database().ref('/contracts/'+$scope.contractId+"/message");
							 		 	myRootRef_proposal_message.push(new_data);
							 		 	var myRootRef_b_submit = firebase.database().ref('/contracts/'+$scope.contractId+"/milestones/"+$scope.milestoneId+"/bonus").set(data.transactions[0].amount.total);
							 		 		var myRootRef_a = firebase.database().ref('/contracts/'+$scope.contractId);
							            myRootRef_a.once("value", function(contract) {
							            	$ionicLoading.show({
								      template: 'Proccessing...'
								    });
							            	if(contract.val())
							            	{
								            	$scope.contract=contract.val();
								            	for(var key in $scope.contract.milestones)
								            	{
								            		if(!$scope.contract.milestones[key].status)
								            			$scope.milestoneIsRemaining=true;

								            		if($scope.contract.milestones[key].status=='submitted')
								            			$scope.milestoneIsSubmitted=true;
								            		if($scope.contract.milestones[key].status=='working')
								            			$scope.milestoneIsWorking=true;
								            	}
								            	$ionicLoading.show({
															      template: 'Proccessing...'
															    });
								            	$timeout(function(){ 
												  if($scope.milestoneIsRemaining!=true && $scope.milestoneIsWorking!=true && $scope.milestoneIsSubmitted!=true)
								                {
								                  
								                  $rootScope.endcontractby="employer";
								                  window.location.replace("#/app/endcontract/"+$scope.contractId);
								                  $ionicLoading.hide();
								                }
								                else
								                {
								                	window.location.replace('#/app/contract/details/emp/'+$scope.contractId);
								                	$ionicLoading.hide();
								                }
												},10000);
								            	
									        }
									        
							            });
							 		 	
							 		 }
							 	}, function errorCallback(response) {
                      			console.log(response);
                      				$ionicLoading.hide();
                      	
                      		});
 	
	        			}
	        		},3000);

	        });
	        }
	        	else
	        	{
	        		alert("eror");
	        		$ionicLoading.hide();
	        	}
	        }, function errorCallback(response) {
                      			console.log(response);
                      	$ionicLoading.hide();
                      		});
 }

$scope.firstpayment=function()
{
	
		 	
		  $ionicLoading.show({
		      template: 'Loading...'
		    });
	 			var myRootRef_a = firebase.database().ref('/jobproposals/'+$scope.proposalid);
		            myRootRef_a.once("value", function(contract) {
		            	if(contract.val())
		            	{
		            		$scope.contract=contract.val();
		            		$scope.jobid=$scope.contract.jobid;
		            		var myRootRef_job = firebase.database().ref('/jobs/'+$scope.jobid);
		            		 myRootRef_job.once("value", function(job) {
		            		 	$scope.job=job.val();
		            		});
						for(var key in $scope.contract.milestones)
		            	{
		            		if(!$scope.contract.milestones[key].status && !$scope.milestone)
		            		{
		            			$scope.milestone=$scope.contract.milestones[key];
		            			$scope.milestoneId=key;
		            		}
		            	}
		            	setTimeout(function(){
				            	if($scope.milestone)
				            	{
				            		if(!$scope.milestone.status)
				            		{
				            			
										$scope.payFirstPaymentProccess('paypal');
				            		}
				            		else
				            		{
				            			$location.path('/app/mainpage');
				            		}
				            	}
				            	else
				            	{
				            		$location.path('/app/mainpage');
				            	}
				            	$ionicLoading.hide();
			            	},2000);
				         }
				         else
				         {
				         	$location.path('/app/mainpage');
				         }
		            	
		            });
}

$scope.payFirstPaymentProccess=function(payType)
{
	
	$ionicLoading.show({ template: 'Proccessing...'});
	if(!$scope.milestone.status && $scope.milestoneId && $scope.proposalid && $scope.job)
	{
		$ionicLoading.show({template: 'Proccessing...'});
	var myRootRef_a = firebase.database().ref('/jobproposals/'+$scope.proposalid);
			 			 myRootRef_a.once("value", function(proposal) {
			 			 	$ionicLoading.show({template: 'Proccessing...'});
			 			 	var contract_start_on=new Date();
			 			 	var myRootRef_contracts = firebase.database().ref('/contracts/');
			 			 	var data=proposal.val();
			 			 	if(data.milestones[0])
			 			 		data.milestones[0].status="working";
			 			 	data.contract_start_on=contract_start_on.toString();
			 			 	var contract_id=myRootRef_contracts.push(data);
			 			 	if(contract_id.key)
			 			 	{
			 			 	var sendDate=new Date();
							 	var new_data=JSON.parse(angular.toJson({message:"Contract started  *",date:sendDate,type:'employer',system_message:"true",status:'unread'}));
							 	var myRootRef_proposal_message = firebase.database().ref('/jobproposals/'+$scope.proposalid+"/message");
							 	myRootRef_proposal_message.push(new_data);
							 	$ionicLoading.show({template: 'Proccessing...'});
							 	$http({
		                      method: 'POST',
		                      url: window.location.origin+'/transaction.php',
		                       data: {token:$rootScope.loggedUserId,type:'milestone_payment',domain:window.location.origin,milestone:$scope.milestoneId,contract:contract_id.key,job:$scope.contract.jobid,payType:payType,payPalTransationResponce:$scope.payPalTransationResponce},
		                       headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		                    }).then(function successCallback(response) {
	                       			
	                       			$ionicLoading.show({
						      template: 'Proccessing...'
						    });
	                       // var date = new Date(response.data+' UTC');
							//console.log(date.toString());
	                      
			                       if(response.data=="success")
			                     	{
			                     		$ionicLoading.show({template: 'Proccessing...' });
						 			 		var myRootRef_remove_proposal = firebase.database().ref('/jobproposals/'+$scope.proposalid);
							 			 	myRootRef_remove_proposal.remove();
							 			 	var myRootRef_job = firebase.database().ref('/jobs/'+$scope.contract.jobid+"/status").set("working");
						           	      
						           	      
						           	      $rootScope.clearBrowserHistory=true;
						           	       var myRootRef_timeline = firebase.database().ref('/users/'+$scope.contract.employer_id+'/timeline');
														var collectionRef_timeline = myRootRef_timeline.push({publishAt:sendDate.toString(),title:'Hired talent for job.',subTitle:$scope.job.title,description:$scope.job.description,type:"jobs",reference:$scope.contract.jobid,statusline:""});
														var myRootRef_timeline1 = firebase.database().ref('/users/'+$scope.contract.talent_id+'/timeline');
														var collectionRef_timeline1 = myRootRef_timeline1.push({publishAt:sendDate.toString(),title:'Hired for job.',subTitle:$scope.job.title,description:$scope.job.description,type:"jobs",reference:$scope.contract.jobid,statusline:""});
											
											 	var new_data=JSON.parse(angular.toJson({message:'Contract confirmed and funded first milestone.',date:sendDate,type:'employer',status:'unread',system_message:"true"}));
												var myRootRef_proposal_message = firebase.database().ref('/contracts/'+contract_id.key+"/message");
												myRootRef_proposal_message.push(new_data);
											    
											    var notification_data=JSON.parse(angular.toJson({date:sendDate,message:$rootScope.userdata.name+'(Employer) confirmed contract and funded first milestone for job  "'+$scope.job.title+'"',type:'contractmessage',sender:$rootScope.loggedUserId,senderName:$rootScope.userdata.name,status:'unread'}));
											    var ref = firebase.database().ref('/notification/'+$scope.contract.talent_id);
											    ref.push(notification_data);
						           	       var myRootRef_proposals= firebase.database().ref('/jobproposals/').orderByChild('jobid').equalTo($scope.contract.jobid);
								          
								            myRootRef_proposals.once("value", function(proposals) {
								            	
								            	if(proposals.val())
								            	{
								            		
								            		for(var key in proposals.val())
								            		{
								            			
								            			var myRootRef_proposals_remove= firebase.database().ref('/jobproposals/'+key);
								            			var proposalRef = firebase.database().ref('/jobproposalsClosed/'+key).set(proposals.val()[key]);
								            			
								            			var notification_data=JSON.parse(angular.toJson({date:sendDate,message:'Your proposal to the job "'+$scope.job.title+'" was declined. Employer picked another freelancer',type:'contractmessage',sender:$rootScope.loggedUserId,senderName:$rootScope.userdata.name,status:'unread'}));
    													var ref = firebase.database().ref('/notification/'+proposals.val()[key].talent_id);
    													ref.push(notification_data);

								            			myRootRef_proposals_remove.remove();
								            			

								            		}
								            		setTimeout(function(){
								            			var Backlen=history.length;   
											             history.go(-Backlen); 
											      		window.location.replace("#/app/contract/details/emp/"+contract_id.key);
								            		},5000);
								            	}
								            	else{
								            		var Backlen=history.length;   
											         history.go(-Backlen);
								            		 window.location.replace("#/app/contract/details/emp/"+contract_id.key);
								            	}
								            });
									}
			 			 				}, function errorCallback(response) {
                      			console.log(response);
                      			$ionicLoading.hide();
                      
                      		});
		                }
			 			 });
			           	
}
}
Analytics.trackPage('Payment_Using_Paypal');
}
];