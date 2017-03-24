'use strict';
module.exports = [
    '$scope','$rootScope','$http','$ionicLoading','Analytics','taskObj', function($scope,$rootScope,$http,$ionicLoading,Analytics,taskObj) {
   console.log("taskObj ");
   // $scope.item = taskObj;
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
		

		var ref1 = firebase.database().ref("/transactions/").orderByChild('employer_id').equalTo($rootScope.loggedUserId);
        ref1.on("value", function(snapshot) {
         	$scope.MyEmployerAccount=snapshot.val();
         	$scope.MyEmployerAccountEscrowUSD=0;
             $scope.MyEmployerAccountEscrowHKD=0;   
         	for(var key in $scope.MyEmployerAccount)
         	{
         		if($scope.MyEmployerAccount[key].payment_status=='escrow' && $scope.MyEmployerAccount[key].currency=='USD')
         			$scope.MyEmployerAccountEscrowUSD=parseFloat($scope.MyEmployerAccountEscrowUSD)+parseFloat($scope.MyEmployerAccount[key].amount);
         		
         		if($scope.MyEmployerAccount[key].payment_status=='escrow' && $scope.MyEmployerAccount[key].currency=='HKD')
         			$scope.MyEmployerAccountEscrowHKD=parseFloat($scope.MyEmployerAccountEscrowHKD)+parseFloat($scope.MyEmployerAccount[key].amount);
         		
         		
         	}
         });

        
        
        
        
        var ref2 = firebase.database().ref("/transactions/").orderByChild('talent_id').equalTo($rootScope.loggedUserId);
        ref2.on("value", function(snapshot) {
         	$scope.MyTalentAccount=snapshot.val();
         	$scope.MyTalentAccountEscrowUSD=0;
            $scope.MyTalentAccountEscrowHKD=0;
         	for(var key in $scope.MyTalentAccount)
         	{
         		if($scope.MyTalentAccount[key].payment_status=='escrow' && $scope.MyTalentAccount[key].currency=='USD')
         		$scope.MyTalentAccountEscrowUSD=parseFloat($scope.MyTalentAccountEscrowUSD)+parseFloat($scope.MyTalentAccount[key].amount);

         		if($scope.MyTalentAccount[key].payment_status=='escrow' && $scope.MyTalentAccount[key].currency=='HKD')
         		$scope.MyTalentAccountEscrowHKD=parseFloat($scope.MyTalentAccountEscrowHKD)+parseFloat($scope.MyTalentAccount[key].amount);
         		
         		
         	}
         	$ionicLoading.hide();
         });
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
                
                 console.log($scope.myAccountAvailableHKD);
            }
           
         });
	}
    Analytics.trackPage('My_Money');
}
];