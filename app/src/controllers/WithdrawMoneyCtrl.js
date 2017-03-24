'use strict';
module.exports = [
    '$scope','$rootScope','$http','$ionicLoading','$ionicPopup','$location','Analytics', function($scope,$rootScope,$http,$ionicLoading,$ionicPopup,$location,Analytics) {
    $rootScope.checkLogin();
	/*if($rootScope.loggedUserId)
	{
	 $http({
		method: 'POST',
		url: window.location.origin+'/transaction.php',
		data: {token:$rootScope.loggedUserId,type:'getMyMoney',domain:window.location.origin},
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		}).then(function successCallback(response) {
			console.log(response);

		}, function errorCallback(response) {
			console.log(response);
	 });
	}*/
	if($rootScope.loggedUserId)
	{
		 $ionicLoading.show({
      template: 'Loading...'
    });
		
		$scope.MyEmployerAccountEscrowUSD=0;
		$scope.MyEmployerAccountEscrowHKD=0;
		$scope.MyTalentAccountEscrowUSD=0;
		$scope.MyTalentAccountEscrowHKD=0;

		
        var ref3 = firebase.database().ref("/transactions/").orderByChild('moneyof').equalTo($rootScope.loggedUserId);
        ref3.on("value", function(snapshot) {
            $scope.MyAvialableAccount=snapshot.val();
            $scope.myAccountAvailableUSD=0;
                $scope.myAccountAvailableHKD=0;
            for(var key in $scope.MyAvialableAccount)
            {
                if($scope.MyAvialableAccount[key].payment_status=='available' && $scope.MyAvialableAccount[key].currency=='USD')
                $scope.myAccountAvailableUSD=parseFloat($scope.myAccountAvailableUSD)+parseFloat($scope.MyAvialableAccount[key].amount);

                if($scope.MyAvialableAccount[key].payment_status=='available' && $scope.MyAvialableAccount[key].currency=='HKD')
                $scope.myAccountAvailableHKD=parseFloat($scope.myAccountAvailableHKD)+parseFloat($scope.MyAvialableAccount[key].amount);
                
               
            }
           $ionicLoading.hide();
         });
	}
    $scope.withdrawUSD=function(email)
    {
       $scope.paymentVarifyUSDStatus=false;
     $ionicPopup.show({
              template: '<input type="password" ng-model="$root.tempwifidata.wifi1">',
              title: 'Enter your password',
              subTitle: 'Please enter your worklidate account password to continue.',
              scope: $rootScope,
              buttons: [
                { text: 'Cancel' },
                {
                  text: '<b>Confirm</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                    if (!$rootScope.tempwifidata.wifi1) {
                      //don't allow the user to close unless he enters wifi password
                      e.preventDefault();
                    } else {
                      return $rootScope.tempwifidata.wifi1;
                    }
                  }
                }
              ]
            }).then(function(res) {
               return firebase.auth().signInWithEmailAndPassword(JSON.parse(window.localStorage.getItem('info')).email, res).then(function(authData) {
                
                if(authData.emailVerified) {
                  $scope.paymentVarifyUSDStatus=true;
                  $scope.paymentVarifyUSD(email);
                  
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
$scope.paymentVarifyUSD=function(email)
{
    if($scope.paymentVarifyUSDStatus==true)
    {
        
        if(email)
        {
            var confirmPopup = $ionicPopup.confirm({
                 title: 'Withdraw',
                 template: 'Are you sure you want to withdraw USD '+$scope.myAccountAvailableUSD+' to '+email+'?'
               });

               confirmPopup.then(function(res) {
                 if(res) {
                     $ionicLoading.show({
                          template: 'Loading...'
                        });
                       var ref3 = firebase.database().ref("/transactions/").orderByChild('moneyof').equalTo($rootScope.loggedUserId);
                        ref3.once("value", function(snapshot) {
                            if($scope.myAccountAvailableUSD>=3)
                            {
                            $http({
                                    method: 'POST',
                                    url: window.location.origin+'/transaction.php',
                                    data: {token:$rootScope.loggedUserId,type:'checkMyBalance',domain:window.location.origin,transactions:snapshot.val(),currency:'USD'},
                                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                                    }).then(function successCallback(response) {
                                                if(parseInt(response.data)>=3)
                                                {
                                                    $http({
                                                        method: 'POST',
                                                        url: window.location.origin+'/transaction.php',
                                                        data: {token:$rootScope.loggedUserId,type:'withdraw',domain:window.location.origin,transactions:snapshot.val(),currency:'USD',email:email},
                                                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                                                        }).then(function successCallback(response) {
                                                                    if(response.data=="success")
                                                                    {
                                                                        $ionicLoading.hide();
                                                                       $location.path("/app/mymoney");
                                                                    }
                                                                    else
                                                                    {
                                                                         $ionicLoading.hide();
                                                                        alert("Something went wrong. Please try again later.");
                                                                    }
                                                        }, function errorCallback(response) {
                                                            
                                                             $ionicLoading.hide();
                                                             alert("Something went wrong. Please try again later.");
                                                        }); 
                                                }
                                    }, function errorCallback(response) {
                                        
                                         $ionicLoading.hide();
                                         alert("Something went wrong. Please try again later.");
                                    }); 
                           $ionicLoading.hide();
                       }
                       

                         });    

                 } else {
                   console.log('You are not sure');
                 }
               });
        }
        else
        {   
            alert("Please enter email id.");
        }
    }
}
     $scope.withdrawHKD=function(email)
    {
          $scope.paymentVarifyHKDStatus=false;
     $ionicPopup.show({
              template: '<input type="password" ng-model="$root.tempwifidata.wifi2">',
              title: 'Enter your password',
              subTitle: 'Please enter your worklidate account password to continue.',
              scope: $rootScope,
              buttons: [
                { text: 'Cancel' },
                {
                  text: '<b>Confirm</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                    if (!$rootScope.tempwifidata.wifi2) {
                      //don't allow the user to close unless he enters wifi password
                      e.preventDefault();
                    } else {
                      return $rootScope.tempwifidata.wifi2;
                    }
                  }
                }
              ]
            }).then(function(res) {
               return firebase.auth().signInWithEmailAndPassword(JSON.parse(window.localStorage.getItem('info')).email, res).then(function(authData) {
                
                if(authData.emailVerified) {
                  $scope.paymentVarifyHKDStatus=true;
                  $scope.paymentVarifyHKD(email);
                  
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
$scope.paymentVarifyHKD=function(email)
{
    if($scope.paymentVarifyHKDStatus==true)
    {
        
        if(email)
        {
            var confirmPopup = $ionicPopup.confirm({
                 title: 'Withdraw',
                 template: 'Are you sure you want to withdraw HKD '+$scope.myAccountAvailableHKD+' to '+email+'?'
               });

               confirmPopup.then(function(res) {
                 if(res) {
                     $ionicLoading.show({
                          template: 'Loading...'
                        });
                       var ref3 = firebase.database().ref("/transactions/").orderByChild('moneyof').equalTo($rootScope.loggedUserId);
                        ref3.once("value", function(snapshot) {
                            
                       if($scope.myAccountAvailableHKD>=20)
                            {
                            $http({
                                    method: 'POST',
                                    url: window.location.origin+'/transaction.php',
                                    data: {token:$rootScope.loggedUserId,type:'checkMyBalance',domain:window.location.origin,transactions:snapshot.val(),currency:'HKD'},
                                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                                    }).then(function successCallback(response) {
                                                if(parseInt(response.data)>=20)
                                                {
                                                    $http({
                                                        method: 'POST',
                                                        url: window.location.origin+'/transaction.php',
                                                        data: {token:$rootScope.loggedUserId,type:'withdraw',domain:window.location.origin,transactions:snapshot.val(),currency:'HKD',email:email},
                                                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                                                        }).then(function successCallback(response) {
                                                                    if(response.data=="success")
                                                                    {
                                                                         $ionicLoading.hide();
                                                                       $location.path("/app/mymoney");

                                                                    }
                                                                    else
                                                                    {
                                                                         $ionicLoading.hide();
                                                                        alert("Something went wrong. Please try again later.");
                                                                    }
                                                        }, function errorCallback(response) {
                                                           
                                                             $ionicLoading.hide();
                                                             alert("Something went wrong. Please try again later.");
                                                        }); 
                                                }
                                    }, function errorCallback(response) {
                                        
                                         $ionicLoading.hide();
                                         alert("Something went wrong. Please try again later.");
                                    }); 
                          
                       }

                         });    

                 } else {
                   console.log('You are not sure');
                 }
               });
        }
        else
        {   
            alert("Please enter email id.");
        }
    }
}
    Analytics.trackPage('Withdraw_Money');
}
];