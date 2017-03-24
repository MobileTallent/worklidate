'use strict';
module.exports = [
    '$scope','$rootScope','$http','$ionicLoading','Analytics', function($scope,$rootScope,$http,$ionicLoading,Analytics) {
	$rootScope.checkLogin();
	 if($rootScope.userdata)
 		if($rootScope.userdata.paymethodemail)
 		$scope.data.payemail=$rootScope.userdata.paymethodemail;

	$scope.submit=function(email)
	{

			if(email)
			{
				$ionicLoading.show({
			      template: 'Loading...'
			    });
				$http({
		              method: 'POST',
		              url: window.location.origin+'/transaction.php',
		               data: {token:$rootScope.loggedUserId,type:'paymethodemail',domain:window.location.origin,email:email},
		               headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		            }).then(function successCallback(response) {
		           			
		           			$ionicLoading.hide();
		                   // var date = new Date(response.data+' UTC');
							//console.log(date.toString());
		                  
		                   if(response.data=="success")
		                 	{
		                 		alert("Paypal email address is address successfully.");
							}
							else
							{
								alert('Something went wrong. Please try again later.');
							}

		                 	}, function errorCallback(response) {
		              			console.log(response);
		              			alert('Something went wrong. Please try again later.');
		              			$ionicLoading.hide();
		      				});
	        }
	        else
	        {
	        	alert("Please enter your paypal email address");
	        }
	}
	Analytics.trackPage('Payment_Method');
}
];