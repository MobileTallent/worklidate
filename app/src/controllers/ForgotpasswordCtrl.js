'use strict';
module.exports = [
    '$scope','$rootScope','$ionicLoading','$state','Analytics',function($scope,$rootScope,$ionicLoading,$state,Analytics) {
	
 $scope.forgetpassword=function(resetemail)
 {
$ionicLoading.show({
      template: 'Loading...'
    });
firebase.auth().sendPasswordResetEmail(resetemail).then(function(data) {

 		
	    alert("Password reset email sent successfully");
	     $ionicLoading.hide();
	     $state.go('app.login');
}, function(error) {
 
   console.log("Error sending password reset email:", error);
	    alert("Error sending password reset email: "+error.message);
	     $ionicLoading.hide();
});

 


 }
  Analytics.trackPage('Forgot_Password');
}
];

