'use strict';
module.exports = [
    '$scope','$http','$ionicModal','$rootScope','Firebase','$ionicPopup','$stateParams','$ionicLoading','$location','$timeout',function($scope,$http,$ionicModal,$rootScope,Firebase,$ionicPopup,$stateParams,$ionicLoading,$location,$timeout) {
 $scope.showPaymentbtn=true;
 $rootScope.checkLogin();
 $scope.showpage=true;
 if($stateParams.contractId)
 {
 	if($stateParams.id)
 {
	 	$scope.contractId=$stateParams.contractId;
	 	$scope.milestoneId=$stateParams.id;
	  $ionicLoading.show({
	      template: 'Loading...'
	    });
 			var myRootRef_a = firebase.database().ref('/contracts/'+$stateParams.contractId);
	            myRootRef_a.once("value", function(contract) {
	            	$scope.contract=contract.val();
	            	$scope.milestone=$scope.contract.milestones[$stateParams.id];
	            	if($scope.milestone)
	            	{
	            		if($scope.milestone.status=="submitted")
	            		{
	            			
	            			var ref_check_trans_initialdata = firebase.database().ref("/cardTransactionDataInitialise/").orderByChild('proposalid').equalTo($scope.contractId);
								 	ref_check_trans_initialdata.once("value", function(cardTransactionDataInitialise_snap) {
								 		for(var tk in cardTransactionDataInitialise_snap.val())
								 		{
								 			if(cardTransactionDataInitialise_snap.val()[tk].payment=="success" && cardTransactionDataInitialise_snap.val()[tk].proposalid==$scope.contractId)
								 			{
								 				$scope.cardTransData_id=tk;
								 				$scope.payPalTransationResponce=cardTransactionDataInitialise_snap.val()[tk].paymentData;
												$scope.payBonusProccess('card',cardTransactionDataInitialise_snap.val()[tk].bonusdata);
								 				
        									}
								 		}
								 		

								 		
								 	});

	            			var myRootRef_job = firebase.database().ref('/jobs/'+$scope.contract.jobid);
			            myRootRef_job.once("value", function(job) {
			            	$scope.job=job.val();
			            	var ref3 = firebase.database().ref("/transactions/").orderByChild('moneyof').equalTo($rootScope.loggedUserId);
							 ref3.once("value", function(snapshot) {
								if(snapshot.val())
								{
									$http({
										method: 'POST',
										url: window.location.origin+'/transaction.php',
										data: {token:$rootScope.loggedUserId,type:'checkMyBalance',domain:window.location.origin,transactions:snapshot.val(),currency:$scope.contract.currency},
										headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
										}).then(function successCallback(response) {
										   
										   
										    	$ionicLoading.hide();
										    if(parseInt(response.data))
										    {
										        
													$scope.MyAccountBalance=parseInt(response.data);
										   }
										}, function errorCallback(response) {
								            console.log(response);
								            	$ionicLoading.hide();
								      }); 
									}
									else
									{
										
											$ionicLoading.hide();                   
									}
							});

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
	            
 }
 $ionicModal.fromTemplateUrl('bonuscardDetails.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
    $scope.showForm=true;
   $scope.payPalTransationResponce=[];
 $scope.approve=function(data,from)
 {
 	$scope.paymentVarifyStatus=false;
	 $ionicPopup.show({
              template: '<input type="password" ng-model="$root.tempwifidata.wifi3">',
              title: 'Enter your password',
              subTitle: 'Please enter your worklidate account password to continue.',
              scope: $rootScope,
              buttons: [
                { text: 'Cancel' },
                {
                  text: '<b>Confirm</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                    if (!$rootScope.tempwifidata.wifi3) {
                      //don't allow the user to close unless he enters wifi password
                      e.preventDefault();
                    } else {
                      return $rootScope.tempwifidata.wifi3;
                    }
                  }
                }
              ]
            }).then(function(res) {
               return firebase.auth().signInWithEmailAndPassword(JSON.parse(window.localStorage.getItem('info')).email, res).then(function(authData) {
                
                if(authData.emailVerified) {
                	
                	$scope.paymentVarifyStatus=true;
                  $scope.paymentVarify(data,from);
                  
                }
                else{
                alert("Login failed. Please try again.");
                  e.preventDefault();
              }
              }, function(error) {
                alert("Login failed. Please try again.");
                  e.preventDefault();
              });
              
            });
	
}
$scope.paymentVarify=function(data,from)
{
	
	if($scope.paymentVarifyStatus==true)
	{
		

 		if(data.milestoneaction=="approve" && !data.bonusamount)
 	 	{
 	 		
 	 		 var confirmPopup = $ionicPopup.confirm({
			     title: 'Confirm ?',
			     template: '<div>1. Sure to complete this milestone?</div><div>2. '+$scope.contract.currency+' '+$scope.milestone.budget+' will be released</div>'
			   });

			   confirmPopup.then(function(res) {
			     if(res) {
			     	 $scope.showPaymentbtn=false;
			     	  $scope.showpage=false;
				     	$ionicLoading.show({
					      template: 'Loading...'
					    });	
				    	var transactions_id=null;
			 	 		var ref1 = firebase.database().ref("/transactions/").orderByChild('contractid').equalTo($stateParams.contractId);
				        ref1.once("value", function(snapshot) {
				        	$ionicLoading.show({
								      template: 'Proccessing...'
								    });
				        	if(!$scope.$$phase)
				        	{$scope.$apply();}
				        	
							for(var key in snapshot.val())
				        		if(snapshot.val()[key].milestoneid==$stateParams.id && snapshot.val()[key].payment_status=='escrow')
				        			transactions_id=key;
				        			var milestone_amount=snapshot.val()[key].amount;
				        		setTimeout(function(){
				        			$ionicLoading.show({
								      template: 'Proccessing...'
								    });
								    if(!$scope.$$phase)
				        			{$scope.$apply();}
				        		
				        			if(transactions_id!=null)
				        			{
				        				
				        				$http({
					                      method: 'POST',
					                      url: window.location.origin+'/transaction.php',
					                       data: {token:$rootScope.loggedUserId,type:'milestone_approved',domain:window.location.origin,milestone:$stateParams.id,contract:$stateParams.contractId,job:$scope.contract.jobid,transactionsId:transactions_id},
					                       headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
					                    }).then(function successCallback(response) {
					                    	$ionicLoading.show({
								     			 template: 'Proccessing...'
								    		});
								    		if(!$scope.$$phase)
				        					{$scope.$apply();}

				                       			
				                       			//$ionicLoading.hide();
				                       // var date = new Date(response.data+' UTC');
										
				                      
						                       if(response.data=="success")
						                     	{
													 		
													 		$ionicLoading.show({
								      						template: 'Proccessing...'
								    						});
								    						if(!$scope.$$phase)
				        									{$scope.$apply();}

							 	 					var sendDate=new Date();
										 	 		var myRootRef_submit = firebase.database().ref('/contracts/'+$stateParams.contractId+"/milestones/"+$stateParams.id).update({status:"approved",approved_on:sendDate});
										 	 		var myRootRef_assign_new = firebase.database().ref('/contracts/'+$stateParams.contractId+"/assigned_milestone").set("false");
										 		 	
										 		 	var new_data=JSON.parse(angular.toJson({message:"Milestone approved. Paid "+$scope.contract.currency+" "+milestone_amount+" *",date:sendDate,type:'employer',subtype:"milestone_approved",data:"/"+$stateParams.contractId+"/"+$stateParams.id,system_message:"true",status:'unread'}));
										 		 	var myRootRef_proposal_message = firebase.database().ref('/contracts/'+$stateParams.contractId+"/message");
										 		 	myRootRef_proposal_message.push(new_data);

										 		 	var myRootRef_a = firebase.database().ref('/contracts/'+$stateParams.contractId);
										            myRootRef_a.once("value", function(contract) {
										            	$ionicLoading.show({
													      template: 'Loading...'
													    });	
													    if(!$scope.$$phase)
				        									{$scope.$apply();}

										            	if(contract.val())
										            	{
										            		$ionicLoading.show({
															      template: 'Proccessing...'
															    });
										            		if(!$scope.$$phase)
				        									{$scope.$apply();}

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
											            	if(!$scope.$$phase)
				        									{$scope.$apply();}

											            	$timeout(function(){ 
											            		
															  if($scope.milestoneIsRemaining!=true && $scope.milestoneIsWorking!=true && $scope.milestoneIsSubmitted!=true)
											                {
											                  
											                  $rootScope.endcontractby="employer";
											                  var sendDate=new Date();
															  
															  var new_data=JSON.parse(angular.toJson({message:'Contract completed. Please give a feedback. *',date:sendDate,type:'employer',status:'unread',system_message:"true"}));
															  var myRootRef_proposal_message = firebase.database().ref('/contracts/'+$scope.contractId+"/message");
															  myRootRef_proposal_message.push(new_data);
															  var myRootRef_a = firebase.database().ref('/contracts/'+$scope.contractId);
															  myRootRef_a.update({status:"completed",contract_completed_on:sendDate});
															  var myRootRef_job = firebase.database().ref('/jobs/'+$scope.contract.jobid+"/status").set("completed");
															  setTimeout(function(){
															  	var Backlen=history.length;   
														      history.go(-Backlen);
											            	  window.location.replace("#/app/endcontract/"+$stateParams.contractId);

											                 
											                  $ionicLoading.hide();
															  },1000);
											                  
											                }
											                else
											                {
											                	var new_data=JSON.parse(angular.toJson({message:'Please assign next milestone for talent from contract details page.',date:sendDate,type:'talent',status:'unread',hide:'true'}));
															 	var myRootRef_proposal_message = firebase.database().ref('/jobproposals/'+$stateParams.contractId+"/message");
															 	myRootRef_proposal_message.push(new_data);
															 	var notification_data=JSON.parse(angular.toJson({date:sendDate,message:'Please assign next milestone for talent from contract details page.',type:'contractmessage',sender:$rootScope.loggedUserId,senderName:$rootScope.userdata.name,status:'unread'}));
														    	var ref = firebase.database().ref('/notification/'+$scope.contract.employer_id);
														    	ref.push(notification_data);
														    	 var Backlen=history.length;   
														         history.go(-Backlen);
											            		 window.location.replace('#/app/contract/details/emp/'+$scope.contractId);

											                	
											                	$ionicLoading.hide();
											                }
															},10000);
											            	
												        }
												        
										            });
				            

										 		 	
										 		 	//if(data.bonusamount)
										 		 	//{
										 		 		//var myRootRef_b_submit = firebase.database().ref('/contracts/'+$stateParams.contractId+"/milestones/"+$stateParams.id+"/bonus").set(data.bonusamount);
										 		 	//}
										 		 }
										 	}, function errorCallback(response) {
			                      			
			                      			alert('Something went wrong. Please try again later.');
			                      			$location.path('/app/contract/details/emp/'+$scope.contractId);
									 		 	$rootScope.reloadContractPage=true;
			                      			$ionicLoading.hide();
			                      
			                      		});
			 	
				        			}
				        		},3000);
				        	
				        });
			 	 			

			     } else {
			       console.log('You are not sure');
			     }
			   });

 	 		
 	 		
 	 	}
 	 	else if(data.milestoneaction=="approve" && data.bonusamount)
 	 	{
 	 		$scope.bonusamount=data.bonusamount;
 	 		var confirmPopup = $ionicPopup.confirm({
			     title: 'Confirm ?',
			     template: '<div>1. Sure to complete this milestone?</div><div>2. '+$scope.contract.currency+' '+$scope.milestone.budget+' will be released</div><div>3. '+$scope.contract.currency+' '+data.bonusamount+' Bonus will be sent.</div>'
			   });

			   confirmPopup.then(function(res) {
			     if(res) {
			     			 $scope.showPaymentbtn=false;
			     				$ionicLoading.show({
						      template: 'Loading...'
						    });
			     			if(!$scope.$$phase)
				        	{$scope.$apply();}

 	 						var ref3 = firebase.database().ref("/transactions/").orderByChild('moneyof').equalTo($rootScope.loggedUserId);
					        ref3.once("value", function(snapshot) {
					        	if(snapshot.val())
					        	{
					        		$ionicLoading.show({
								      template: 'Proccessing...'
								    });
								    if(!$scope.$$phase)
				        			{$scope.$apply();}

						           $http({
			                      	method: 'POST',
			                      	url: window.location.origin+'/transaction.php',
			                       	data: {token:$rootScope.loggedUserId,type:'checkMyBalance',domain:window.location.origin,transactions:snapshot.val(),currency:$scope.contract.currency},
			                       	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			                    	}).then(function successCallback(response) {
			                    		$ionicLoading.show({
								      template: 'Proccessing...'
								    });
			                    		if(!$scope.$$phase)
				        				{$scope.$apply();}

			                    		
			                    		if(parseInt(response.data))
			                    		{
			                    			if(data.bonusamount<=parseFloat(response.data))
			                    			{
												//pay my account
												//alert('my account');
												$scope.ProccessingData=data;
												if(from=='myaccount')
												{

													$scope.payBonusProccess('myaccount',data);

												}
												if(from=='bycard')
												{
													
													$scope.modal.show();
			                    				 	$ionicLoading.hide();
												}

												
			                    			}
			                    			else
			                    			{
			                    				//pay by card
			                    				//$scope.payBonusProccess('card',data);
			                    			
			                    				$scope.ProccessingData=data;
			                    				if(from=='bycard')
												{
													$scope.modal.show();
			                    				 	$ionicLoading.hide();
												}
			                    			}
			                    		}
			                    		else
			                    			{
			                    				//pay by card
			                    				//$scope.payBonusProccess('card',data);
			                    				
			                    				$scope.ProccessingData=data;
			                    				if(from=='bycard')
												{
													$scope.modal.show();
			                    				 	$ionicLoading.hide();
												}
			                    			}
			                    	}, function errorCallback(response) {
	                      				console.log(response);
	                      			}); 
			                    }
			                    else
			                    {
			                    	//pay by card
			                    	//$scope.payBonusProccess('card',data);
			                    	
			                    	$scope.ProccessingData=data;
			                    	if(from=='bycard')
												{
													$scope.modal.show();
			                    				 	$ionicLoading.hide();
												}
			                    }

					       });

			     } else {
			       console.log('You are not sure');
			     }
			   });

 	 		

 	 	
 	 		
 	 	}
 	 	else{

 	 	}
 	 	if(data.milestoneaction=="changesrequired")
 	 	{
 	 		var myRootRef_submit = firebase.database().ref('/contracts/'+$stateParams.contractId+"/milestones/"+$stateParams.id+"/status").set("working");

 		 	var sendDate=new Date();
 		 	
 		 	var new_data=JSON.parse(angular.toJson({message:"The milestone needs additional work. *",date:sendDate,type:'employer',subtype:"milestone_approved",data:"/"+$stateParams.contractId+"/"+$stateParams.id,system_message:"true",status:'unread'}));
 		 	var myRootRef_proposal_message = firebase.database().ref('/contracts/'+$stateParams.contractId+"/message");
 		 	myRootRef_proposal_message.push(new_data);
 		 		 var Backlen=history.length;   
	         history.go(-Backlen);
    		 window.location.replace('#/app/contract/details/emp/'+$scope.contractId);

 		 	
 	
 	 	}
}
 };


 $scope.payBonusProccess=function(payType,data)
 {
 	 
 	$ionicLoading.show({
      template: 'Proccessing...'
    });
    $scope.showpage=false;
 	$http({
                  method: 'POST',
                  url: window.location.origin+'/transaction.php',
                   data: {token:$rootScope.loggedUserId,type:'bonus',domain:window.location.origin,milestone:$stateParams.id,contract:$stateParams.contractId,job:$scope.contract.jobid,amount:data.bonusamount,payType:payType,payPalTransationResponce:$scope.payPalTransationResponce},
                   headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then(function successCallback(response) {
               			
               			$ionicLoading.show({
								      template: 'Proccessing...'
								    });
               				if(!$scope.$$phase)
				        	{$scope.$apply();}

				if(response.data=="success")
				{
				 	 		$ionicLoading.show({
												template: 'Proccessing...'
												});
				 	 		if(!$scope.$$phase)
				        	{$scope.$apply();}

				 	var transactions_id=null;
		 	 		var ref1 = firebase.database().ref("/transactions/").orderByChild('contractid').equalTo($stateParams.contractId);
			        ref1.once("value", function(snapshot) {
	        		for(var key in snapshot.val())
	        		if(snapshot.val()[key].milestoneid==$stateParams.id && snapshot.val()[key].payment_status=='escrow')
	        			transactions_id=key;
	        			var milestone_amount=snapshot.val()[key].amount;
	        		setTimeout(function(){
	        			if(transactions_id!=null)
	        			{
	        				$ionicLoading.show({
								      template: 'Proccessing...'
								    });
	        				if(!$scope.$$phase)
				        	{$scope.$apply();}

	        				$http({
		                      method: 'POST',
		                      url: window.location.origin+'/transaction.php',
		                       data: {token:$rootScope.loggedUserId,type:'milestone_approved',domain:window.location.origin,milestone:$stateParams.id,contract:$stateParams.contractId,job:$scope.contract.jobid,transactionsId:transactions_id},
		                       headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		                    }).then(function successCallback(response) {
		                    	$ionicLoading.show({
								      template: 'Proccessing...'
								    });
		                    		if(!$scope.$$phase)
				        			{$scope.$apply();}
	                       			
	                       			//$ionicLoading.hide();
	                       // var date = new Date(response.data+' UTC');
							//console.log(date.toString());
	                      setTimeout(function(){
			                       if(response.data=="success")
			                     	{
										 		$ionicLoading.show({
															      template: 'Proccessing...'
															    });
										 		if(!$scope.$$phase)
				        						{$scope.$apply();}

				 	 					var sendDate=new Date();
							 	 		var myRootRef_submit = firebase.database().ref('/contracts/'+$stateParams.contractId+"/milestones/"+$stateParams.id).update({status:"approved",approved_on:sendDate});
							 	 		var myRootRef_assign_new = firebase.database().ref('/contracts/'+$stateParams.contractId+"/assigned_milestone").set("false");
							 		 	
							 		 	var new_data=JSON.parse(angular.toJson({message:"Milestone approved. Paid "+$scope.contract.currency+" "+milestone_amount+" and bonus "+$scope.contract.currency+" "+data.bonusamount+". *",date:sendDate,type:'employer',subtype:"milestone_approved",data:"/"+$stateParams.contractId+"/"+$stateParams.id,system_message:"true",status:'unread'}));
							 		 	var myRootRef_proposal_message = firebase.database().ref('/contracts/'+$stateParams.contractId+"/message");
							 		 	myRootRef_proposal_message.push(new_data);
							 		 	var myRootRef_b_submit = firebase.database().ref('/contracts/'+$stateParams.contractId+"/milestones/"+$stateParams.id+"/bonus").set(data.bonusamount);
							 		 		var myRootRef_a = firebase.database().ref('/contracts/'+$stateParams.contractId);
							            myRootRef_a.once("value", function(contract) {
							            	$ionicLoading.show({
								      			template: 'Proccessing...'
								    		});
								    		if(!$scope.$$phase)
				        					{$scope.$apply();}
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
								            	if(!$scope.$$phase)
				        						{$scope.$apply();}

								            	$timeout(function(){ 
												  if($scope.milestoneIsRemaining!=true && $scope.milestoneIsWorking!=true && $scope.milestoneIsSubmitted!=true)
								                {
								                  
								                  $rootScope.endcontractby="employer";
								                  window.location.replace("#/app/endcontract/"+$stateParams.contractId);
								                  $ionicLoading.hide();
								                }
								                else
								                {
								                	window.location.replace('#/app/contract/details/emp/'+$scope.contractId);
								                	$ionicLoading.hide();
								                }
								                if($scope.cardTransData_id)
								            		firebase.database().ref('/cardTransactionDataInitialise/'+$scope.cardTransData_id).remove();

												},5000);
								            	
									        }
									        
							            });
							 		 	
							 		 }
							 		 },10);
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
 $scope.payNow=function(c,type)
{
	$scope.showForm=false;
	
	if($scope.bonusamount && $scope.contract.currency)
	{
		var cardTransData = firebase.database().ref('/cardTransactionDataInitialise/');
		$scope.cardTransData_id=cardTransData.push({milestoneId:$scope.milestoneId,proposalid:$stateParams.contractId,job:$scope.job,bonusdata:$scope.ProccessingData});
			
	$http({
          method: 'POST',
          url: window.location.origin+'/first.php',
           data: {token:$rootScope.loggedUserId,n:c.number,cv:c.cvc,fname:c.fname,lname:c.lname,expM:c.expiration.month,expY:c.expiration.year,amt:$scope.bonusamount,curr:$scope.contract.currency,type:type.toLowerCase(),itemName:"Milestone Bonus",itenDescription:"JOB NAME: "+$scope.job.title+" JOBID:"+$scope.jobid+" MILESTONE:"+$scope.milestone.title+"("+$scope.milestoneId+")",proposalid:$scope.contractId,cardTransData_id:$scope.cardTransData_id.key},
           headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function successCallback(response) {
        	$scope.modal.hide();
        		
        		if(response.data && response.data!="null" && response.data!=null && response.data.state=="approved")
        		{
        				$scope.payPalTransationResponce=response.data;

        				$scope.payBonusProccess('card',$scope.ProccessingData);
        				
        		}
        		else
        		{
        			$scope.showPaymentbtn=true;
        			 $scope.showpage=true;
        			alert("Something went wrong. Please try again later. Contact support team if money is deducted from your account.");
        			$location.path('/app/contract/details/emp/'+$scope.contractId);
									 		 	$rootScope.reloadContractPage=true;
        		}
        		
        		$scope.showresult=true;
        		$scope.result=response.data;
        }, function errorCallback(response) {
        	$scope.showresult=true;
        	$scope.showPaymentbtn=true;
        	 $scope.showpage=true;
        	$scope.modal.hide();
        	
        	alert("Something went wrong. Please try again later. Contact support team if money is deducted from your account.");
        	$location.path('/app/contract/details/emp/'+$scope.contractId);
									 		 	$rootScope.reloadContractPage=true;
              			
              				$ionicLoading.hide();
              	
        });
    }
}
$scope.payPaypal=function(amount)
{
$ionicLoading.show({ template: 'Proccessing...'});
if(!$scope.$$phase)
{$scope.$apply();}
	if(amount && $scope.contract.currency)
	{
		
			$scope.uniqidkey=$rootScope.loggedUserId+(Math.round(+new Date()/1000))+(Math.floor((Math.random() * 1000000) + 1));
	$http({
          method: 'POST',
          url: window.location.origin+'/paypalpayment.php',
           data: {token:$rootScope.loggedUserId,amt:amount,curr:$scope.contract.currency,itemName:"Milestone Bonus",itenDescription:"JOB NAME: "+$scope.job.title+" JOBID:"+$scope.jobid+" MILESTONE:"+$scope.milestone.title+"("+$scope.milestoneId+")",uniqidkey:$scope.uniqidkey},
           headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		 }).then(function successCallback(response) {
        	$ionicLoading.show({ template: 'Proccessing...'});
        	if(!$scope.$$phase)
        	{$scope.$apply();}
        	//alert();
        	
        		if(response.data && response.data!="null" && response.data!=null && response.data.state=="created" && response.data.approvalUrl!=null)
        		{
        				$scope.payPalTransationResponce=[];
        				$scope.payPalTransationResponce.paypal=response.data;
        				$scope.payPalTransationResponce.data={milestoneid:$stateParams.id,contractId:$stateParams.contractId,type:'bonus'}
        				

        				var ref_paypal = firebase.database().ref('/paypalPaymentData/'+$scope.uniqidkey);
    					ref_paypal.set($scope.payPalTransationResponce);

						var Backlen=history.length;   
						history.go(-Backlen);
						window.location.replace(response.data.approvalUrl);
								            	      				
        		}
        		else
        		{
        			$scope.showPaymentbtn=true;
        			 $scope.showpage=true;
        			$ionicLoading.hide();
        			alert("Something went wrong. Please try again later. Contact support team if money is deducted from your account.");
        			$location.path('/app/contract/details/emp/'+$scope.contractId);
									 		 	$rootScope.reloadContractPage=true;
        		}
        		
        		$scope.result=response.data;
        }, function errorCallback(response) {
        	
        			$scope.showPaymentbtn=true;
        			 $scope.showpage=true;
        	alert("Something went wrong. Please try again later. Contact support team if money is deducted from your account.");
              			console.log(response);
              			$location.path('/app/contract/details/emp/'+$scope.contractId);
									 		 	$rootScope.reloadContractPage=true;
              				$ionicLoading.hide();

              	
        });
    }	
}
}
];