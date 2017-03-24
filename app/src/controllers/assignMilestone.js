'use strict';
module.exports = [
    '$scope','$ionicModal','$rootScope','Firebase','$ionicPopup','$stateParams','Analytics','$ionicLoading','$location','$http',function($scope,$ionicModal,$rootScope,Firebase,$ionicPopup,$stateParams,Analytics,$ionicLoading,$location,$http) {
 $rootScope.checkLogin();
 if($stateParams.contractId)
 {
 	
	 	$scope.contractId=$stateParams.contractId;
	 	
	  $ionicLoading.show({
	      template: 'Loading...'
	    });
 			var myRootRef_a = firebase.database().ref('/contracts/'+$stateParams.contractId);
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
			            			
			            			var ref_check_trans_initialdata = firebase.database().ref("/cardTransactionDataInitialise/").orderByChild('proposalid').equalTo($scope.contractId);
								 	ref_check_trans_initialdata.once("value", function(cardTransactionDataInitialise_snap) {
								 		for(var tk in cardTransactionDataInitialise_snap.val())
								 		{
								 			if(cardTransactionDataInitialise_snap.val()[tk].payment=="success" && cardTransactionDataInitialise_snap.val()[tk].proposalid==$scope.contractId)
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
	            	var amount=$scope.milestone.budget;
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
										data: {token:$rootScope.loggedUserId,type:'checkMyBalance',domain:window.location.origin,transactions:snapshot.val(),currency:$scope.job.currency},
										headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
										}).then(function successCallback(response) {
										   

										    	$ionicLoading.hide();
										    if(parseInt(response.data))
										    {
										        
													$scope.MyAccountBalance=parseInt(response.data);
										   }
										}, function errorCallback(response) {
								           
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
			         		$ionicLoading.hide();
			         }
	            
	            });
	        
	            
 }
 
  $scope.showPaymentbtn=true;
  $ionicModal.fromTemplateUrl('assigncardDetails.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

$scope.assignmilestone=function(from)
{ 
$scope.paymentVarifyStatus=false;
	 $ionicPopup.show({
              template: '<input type="password" ng-model="$root.tempwifidata.wifi4">',
              title: 'Enter your password',
              subTitle: 'Please enter your worklidate account password to continue.',
              scope: $rootScope,
              buttons: [
                { text: 'Cancel' },
                {
                  text: '<b>Confirm</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                    if (!$rootScope.tempwifidata.wifi4) {
                      //don't allow the user to close unless he enters wifi password
                      e.preventDefault();
                    } else {
                      return $rootScope.tempwifidata.wifi4;
                    }
                  }
                }
              ]
            }).then(function(res) {
               return firebase.auth().signInWithEmailAndPassword(JSON.parse(window.localStorage.getItem('info')).email, res).then(function(authData) {
              
                if(authData.emailVerified) {
                	$scope.paymentVarifyStatus=true;
                  $scope.paymentVarify(from);
                  
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
$scope.paymentVarify=function(from)
{
	if($scope.paymentVarifyStatus==true)
	{
		var amount=$scope.milestone.budget;
		$ionicLoading.show({
		      template: 'Loading...'
		    });
		if(!$scope.$$phase)
		{$scope.$apply();}
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
			                    	
			                    		if(parseInt(response.data))
			                    		{
			                    			if(amount<=parseFloat(response.data))
			                    			{
												
												
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
			                    				
			                    				if(from=='bycard')
												{
													$scope.modal.show();
			                    				 	$ionicLoading.hide();
												}
			                    			}
			                    		}
			                    		else
			                    			{
			                    				
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
			                    	
			                    if(from=='bycard')
												{
													$scope.modal.show();
			                    				 	$ionicLoading.hide();
												}
			                    }

					       });
					    }
}
$scope.showForm=true;
   $scope.payPalTransationResponce=[];
$scope.payProccess=function(payType)
{
	$ionicLoading.show({ template: 'Proccessing...'});
	if(!$scope.$$phase)
	{$scope.$apply();}

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
						 			 		var myRootRef_submit = firebase.database().ref('/contracts/'+$stateParams.contractId+"/milestones/"+$scope.milestoneId+"/status").set("working");
											var sendDate=new Date();
									 		 	var new_data=JSON.parse(angular.toJson({message:"'"+$scope.milestone.title+"' Milestone assigned *",date:sendDate,type:'employer',subtype:"milestone_assign",system_message:"true",status:'unread'}));
									 		 	var myRootRef_proposal_message = firebase.database().ref('/contracts/'+$stateParams.contractId+"/message");
									 		 	myRootRef_proposal_message.push(new_data);
									 		 	
									 		 	if($scope.cardTransData_id)
								            		firebase.database().ref('/cardTransactionDataInitialise/'+$scope.cardTransData_id.key).remove();

									 		 	$ionicLoading.show();
									 		 	setTimeout(function(){
									 		 		$ionicLoading.hide();
									 		 		$location.path('/app/contract/details/emp/'+$scope.contractId);
									 		 		$rootScope.reloadContractPage=true;
									 		 	},5000);
									 		 	
									 		 	
									}else{
												alert("Something went wrong. Please try again later. Contact support team if money is deducted from your account.");
        									$location.path('/app/contract/details/emp/'+$scope.contractId);
									 		 	$rootScope.reloadContractPage=true;
									}

			 			 				}, function errorCallback(response) {
                      			console.log(response);
                      			$ionicLoading.hide();
                      
                      		});

		
	}
}

$scope.payNow=function(c,type)
{
	$scope.showForm=false;
	
	if($scope.milestone.budget && $scope.job.currency)
	{
		var cardTransData = firebase.database().ref('/cardTransactionDataInitialise/');
		$scope.cardTransData_id=cardTransData.push({milestoneId:$scope.milestoneId,proposalid:$scope.contractId,job:$scope.job});
			

	$http({
          method: 'POST',
          url: window.location.origin+'/first.php',
           data: {token:$rootScope.loggedUserId,n:c.number,cv:c.cvc,fname:c.fname,lname:c.lname,expM:c.expiration.month,expY:c.expiration.year,amt:$scope.milestone.budget,curr:$scope.job.currency,type:type.toLowerCase(),itemName:"Milestone Payment",itenDescription:"JOB NAME: "+$scope.job.title+"  JOBID:"+$scope.contract.jobid+" MILESTONE:"+$scope.milestone.title+"("+$scope.milestoneId+")",proposalid:$scope.contractId,cardTransData_id:$scope.cardTransData_id.key},
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
        			$location.path('/app/contract/details/emp/'+$scope.contractId);
									 		 	$rootScope.reloadContractPage=true;
        		}
        		
        		$scope.showresult=true;
        		$scope.result=response.data;
        }, function errorCallback(response) {
        	$scope.showresult=true;
        	$scope.showPaymentbtn=true;
        	$scope.modal.hide();
        	
        	alert("Something went wrong. Please try again later. Contact support team if money is deducted from your account.");
        	$location.path('/app/contract/details/emp/'+$scope.contractId);
									 		 	$rootScope.reloadContractPage=true;
              			
              				$ionicLoading.hide();
              	
        });
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
           data: {token:$rootScope.loggedUserId,amt:$scope.milestone.budget,curr:$scope.job.currency,itemName:"Milestone Payment",itenDescription:"JOB NAME: "+$scope.job.title+"  JOBID:"+$scope.contract.jobid+" MILESTONE:"+$scope.milestone.title+"("+$scope.milestoneId+")",uniqidkey:$scope.uniqidkey},
           headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function successCallback(response) {
        	$ionicLoading.show({ template: 'Proccessing...'});
        	//alert();
        		if(response.data && response.data!="null" && response.data!=null && response.data.state=="created" && response.data.approvalUrl!=null)
        		{
        				$scope.payPalTransationResponce=[];
        				$scope.payPalTransationResponce.paypal=response.data;
        				$scope.payPalTransationResponce.data={contractId:$stateParams.contractId,type:'nextMilestonePayment'}
        				

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
Analytics.trackPage('Assign_Milestone');
}
];