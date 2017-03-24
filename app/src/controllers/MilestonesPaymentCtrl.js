'use strict';
module.exports = [
    '$scope','$ionicModal','$rootScope','Firebase','$ionicPopup','$stateParams','$ionicLoading','$location','$http','Analytics',function($scope,$ionicModal,$rootScope,Firebase,$ionicPopup,$stateParams,$ionicLoading,$location,$http,Analytics) {
 $scope.jobid=0;
 $rootScope.checkLogin();
 if($stateParams.proposalid && $stateParams.type=='first')
 {
 	
	 	$scope.proposalid=$stateParams.proposalid;
	 	
	  $ionicLoading.show({
	      template: 'Loading...'
	    });
 			var myRootRef_a = firebase.database().ref('/jobproposals/'+$stateParams.proposalid);
	            myRootRef_a.once("value", function(contract) {
	            	if(contract.val())
	            	{
	            		var myRootRef_job = firebase.database().ref('/jobs/'+contract.val().jobid);
	            		 myRootRef_job.once("value", function(job) {
	            		 	$scope.job=job.val();
	            		
				            	var ref3 = firebase.database().ref("/transactions/").orderByChild('moneyof').equalTo($rootScope.loggedUserId);
								 ref3.once("value", function(snapshot) {
									if(snapshot.val())
									{
										$http({
											method: 'POST',
											url: window.location.origin+'/transaction.php',
											data: {token:$rootScope.loggedUserId,type:'checkMyBalance',domain:window.location.origin,transactions:snapshot.val(),currency:$scope.job.currency},
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

	            	$scope.contract=contract.val();
	            	 $scope.jobid=$scope.contract.jobid;
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
			            			var ref_check_trans_initialdata = firebase.database().ref("/cardTransactionDataInitialise/").orderByChild('proposalid').equalTo($stateParams.proposalid);
								 	ref_check_trans_initialdata.once("value", function(cardTransactionDataInitialise_snap) {
								 		for(var tk in cardTransactionDataInitialise_snap.val())
								 		{
								 			if(cardTransactionDataInitialise_snap.val()[tk].payment=="success" && cardTransactionDataInitialise_snap.val()[tk].proposalid==$scope.proposalid)
								 			{
								 				$scope.cardTransData_id=tk;
								 				$scope.payPalTransationResponce=cardTransactionDataInitialise_snap.val()[tk].paymentData;
        										$scope.payProccess('card');
        										
								            				
        											
        									}
								 		}
								 		
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
			         }
	            	$ionicLoading.hide();
	            });
	        
	            
 }
 $scope.showPaymentbtn=true;
  $ionicModal.fromTemplateUrl('cardDetails.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

$scope.makepayment=function(amount,from)
{
	$scope.paymentVarifyStatus=false;
	 $ionicPopup.show({
              template: '<input type="password" ng-model="$root.tempwifidata.wifi5">',
              title: 'Enter your password',
              subTitle: 'Please enter your worklidate account password to continue.',
              scope: $rootScope,
              buttons: [
                { text: 'Cancel' },
                {
                  text: '<b>Confirm</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                    if (!$rootScope.tempwifidata.wifi5) {
                      //don't allow the user to close unless he enters wifi password
                      e.preventDefault();
                    } else {
                      return $rootScope.tempwifidata.wifi5;
                    }
                  }
                }
              ]
            }).then(function(res) {
               return firebase.auth().signInWithEmailAndPassword(JSON.parse(window.localStorage.getItem('info')).email, res).then(function(authData) {
                
                if(authData.emailVerified) {
                	
                	$scope.paymentVarifyStatus=true;
                  $scope.paymentVarify(amount,from);
                  
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
$scope.paymentVarify=function(amount,from)
{
	
	if($scope.paymentVarifyStatus==true)
	{
$scope.showresult=false;
 $scope.showForm=true;
	 var confirmPopup = $ionicPopup.confirm({
     title: 'Milestone Payment',
     template: 'Process to fund '+$scope.job.currency+''+amount +'?'
   });

   confirmPopup.then(function(res) {
     if(res) {
     			if(!$scope.milestone.status && $scope.milestoneId && $scope.proposalid && $scope.job)
	{
		
                     if($stateParams.type='first')
 						{
 							$scope.showPaymentbtn=false;
 							$ionicLoading.show({
						      template: 'Proccessing...'
						    });
 							var ref3 = firebase.database().ref("/transactions/").orderByChild('moneyof').equalTo($rootScope.loggedUserId);
					        ref3.once("value", function(snapshot) {
					        	if(snapshot.val())
					        	{
					        		$ionicLoading.show({
								      template: 'Proccessing...'
								    });
						           $http({
			                      	method: 'POST',
			                      	url: window.location.origin+'/transaction.php',
			                       	data: {token:$rootScope.loggedUserId,type:'checkMyBalance',domain:window.location.origin,transactions:snapshot.val(),currency:$scope.job.currency},
			                       	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			                    	}).then(function successCallback(response) {
			                    		$ionicLoading.show({
								      template: 'Proccessing...'
								    });
			                    		
			                    		if(parseInt(response.data))
			                    		{
			                    			if(amount<=parseFloat(response.data))
			                    			{
												//pay my account
												//alert('my account');
												if(from=='myaccount')
												{
													$scope.payProccess('myaccount');
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
			                    				//$scope.payProccess('card');
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
			                    				//$scope.payProccess('card');
			                    				if(from=='bycard')
												{
													$scope.modal.show();
			                    				 	$ionicLoading.hide();
												}
			                    			}
			                    	}, function errorCallback(response) {
	                      				alert(response);
	                      				
	                      				$ionicLoading.hide();
	                      			}); 
			                    }
			                    else
			                    {
			                    	//pay by card
			                    	//$scope.payProccess('card');
			                 					if(from=='bycard')
												{
													$scope.modal.show();
			                    				 	$ionicLoading.hide();
												}
			                    }

					       });

                     	
                     }
                 }
                 else
                 {
                  	//not first milestone    
				}

     } else {
       console.log('You are not sure');
     }
   });
	
   }
}
   $scope.showForm=true;
   $scope.payPalTransationResponce=[];
$scope.payProccess=function(payType)
{
	$ionicLoading.show({ template: 'Proccessing...'});
	if(!$scope.milestone.status && $scope.milestoneId && $scope.proposalid && $scope.job)
	{
		$ionicLoading.show({template: 'Proccessing...'});
	var myRootRef_a = firebase.database().ref('/jobproposals/'+$stateParams.proposalid);
			 			 myRootRef_a.once("value", function(proposal) {
			 			 	$ionicLoading.show({template: 'Proccessing...'});
			 			 	var contract_start_on=new Date();
			 			 	var myRootRef_contracts = firebase.database().ref('/contracts/');
			 			 	var data=proposal.val();
			 			 	var setMilestoneWorking=false;
			 			 	for(var m in data.milestones)
			 			 	{
			 			 		if(data.milestones[m] && setMilestoneWorking==false)
			 			 		data.milestones[m].status="working";
			 			 		setMilestoneWorking=true;
			 			 	}
			 			 	
			 			 	setTimeout(function(){
			 			 	data.contract_start_on=contract_start_on.toString();
			 			 	var contract_id=myRootRef_contracts.push(data);
			 			 	if(contract_id.key)
			 			 	{
			 			 	var sendDate=new Date();
							 	var new_data=JSON.parse(angular.toJson({message:"Contract started  *",date:sendDate,type:'employer',system_message:"true",status:'unread'}));
							 	var myRootRef_proposal_message = firebase.database().ref('/jobproposals/'+$stateParams.proposalid+"/message");
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
						 			 		var myRootRef_remove_proposal = firebase.database().ref('/jobproposals/'+$stateParams.proposalid);
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
								            			if($scope.cardTransData_id)
								            				firebase.database().ref('/cardTransactionDataInitialise/'+$scope.cardTransData_id.key).remove();

								            		}
								            		var proposalid_contractid = firebase.database().ref('/proposalid_contractid').push({proposalid:$stateParams.proposalid,contractid:contract_id.key});
								            		$ionicLoading.show();
								            		setTimeout(function(){
								            			var Backlen=history.length;   
											             history.go(-Backlen); 
											      		window.location.replace("#/app/contract/details/emp/"+contract_id.key);
											      		$rootScope.reloadContractPage=true;
											      		$ionicLoading.hide();
								            		},5000);
								            	}
								            	else{
								            		var proposalid_contractid = firebase.database().ref('/proposalid_contractid').push({proposalid:$stateParams.proposalid,contractid:contract_id.key});
								            		var Backlen=history.length;   
											         history.go(-Backlen);
											         $ionicLoading.show();
								            		setTimeout(function(){
								            			var Backlen=history.length;   
											             history.go(-Backlen); 
											      		window.location.replace("#/app/contract/details/emp/"+contract_id.key);
											      		$rootScope.reloadContractPage=true;
											      		$ionicLoading.hide();
								            		},5000);
								            	}
								            });
									}
			 			 				}, function errorCallback(response) {
                      			console.log(response);
                      			$ionicLoading.hide();
                      
                      		});
		                }

						},100);

			 			 });
			           	
}
}
$scope.payNow=function(c,type)
{
	$scope.showForm=false;
	if($scope.milestone.budget && $scope.job.currency)
	{
		if(!$scope.milestone.status && $scope.milestoneId && $scope.proposalid && $scope.job)
		{
		var cardTransData = firebase.database().ref('/cardTransactionDataInitialise/');
		$scope.cardTransData_id=cardTransData.push({milestoneId:$scope.milestoneId,proposalid:$scope.proposalid,job:$scope.job});

	$http({
          method: 'POST',
          url: window.location.origin+'/first.php',
           data: {token:$rootScope.loggedUserId,n:c.number,cv:c.cvc,fname:c.fname,lname:c.lname,expM:c.expiration.month,expY:c.expiration.year,amt:$scope.milestone.budget,curr:$scope.job.currency,type:type.toLowerCase(),itemName:"Milestone Payment",itenDescription:"JOB NAME: "+$scope.job.title+"  JOBID:"+$scope.jobid+" MILESTONE:"+$scope.milestone.title+"("+$scope.milestoneId+")",proposalid:$scope.proposalid,cardTransData_id:$scope.cardTransData_id.key},
           headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function successCallback(response) {
        	$scope.modal.hide();
        		if(response.data && response.data!="null" && response.data!=null && response.data.state=="approved")
        		{
        			$scope.payPalTransationResponce=response.data;
        			$scope.payProccess('card');
        				
        		}
        		else
        		{
        			$scope.showPaymentbtn=true;
        			alert("Something went wrong. Please try again later. Contact support team if money is deducted from your account.");
        		}
        		
        		$scope.showresult=true;
        		$scope.result=response.data;
        }, function errorCallback(response) {
        	$scope.showresult=true;
        	$scope.showPaymentbtn=true;
        	$scope.modal.hide();
        	
        	alert("Something went wrong. Please try again later. Contact support team if money is deducted from your account.");
              			
              				$ionicLoading.hide();
              	
        });
    }
    }
}
/*$scope.payPaypal=function()
{
$ionicLoading.show({ template: 'Proccessing...'});
	if($scope.milestone.budget && $scope.job.currency)
	{
		$scope.uniqidkey=$rootScope.loggedUserId+(Math.round(+new Date()/1000))+(Math.floor((Math.random() * 1000000) + 1));
	$http({
          method: 'POST',
          url: window.location.origin+'/paypalpayment.php',
           data: {token:$rootScope.loggedUserId,domain:window.location.origin,amt:$scope.milestone.budget,curr:$scope.job.currency,itemName:"Milestone Payment",itenDescription:"JOB NAME: "+$scope.job.title+" JOBID:"+$scope.jobid+" MILESTONE:"+$scope.milestone.title+"("+$scope.milestoneId+")",uniqidkey:$scope.uniqidkey},
           headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function successCallback(response) {
        	$ionicLoading.show({ template: 'Proccessing...'});
        	//alert();
        		if(response.data && response.data!="null" && response.data!=null && response.data.state=="created" && response.data.approvalUrl!=null)
        		{
        				$scope.payPalTransationResponce=[];
        				$scope.payPalTransationResponce.paypal=response.data;
        				$scope.payPalTransationResponce.data={proposalid:$stateParams.proposalid,type:'firstpayment'}
        				

        				var ref_paypal = firebase.database().ref('/paypalPaymentData/'+$scope.uniqidkey);
    					ref_paypal.set($scope.payPalTransationResponce);

						var Backlen=history.length;   
						history.go(-Backlen);
						window.location.replace(response.data.approvalUrl);
								            	      				
        		}
        		else
        		{
        			$scope.showPaymentbtn=true;
        			$ionicLoading.hide();
        			alert("Something went wrong. Please try again later. Contact support team if money is deducted from your account.");
        		}
        		
        		$scope.result=response.data;
        }, function errorCallback(response) {
        	
        			$scope.showPaymentbtn=true;
        	alert("Something went wrong. Please try again later. Contact support team if money is deducted from your account.");
              			console.log(response);
              				$ionicLoading.hide();
              	
        });
    }	
}*/


Analytics.trackPage('First_Milestone_Payment');
}
];