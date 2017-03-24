'use strict';
module.exports = [
    '$scope','$ionicModal','$rootScope','Firebase','$ionicPopup','Analytics', function($scope,$ionicModal,$rootScope,Firebase,$ionicPopup,Analytics) {

$rootScope.checkLogin();
 var get_faq = firebase.database().ref("/faq");
   get_faq.on("value", function(faqs) {
  $scope.faqs=[];
    for(var key in faqs.val())
	 {
	 var d=faqs.val()[key];
	 d.id=key;
	 $scope.faqs.push(d);
	 
	 }
   if(!$scope.$$phase) {
 		$scope.$apply();
 		
		}
 });
 Analytics.trackPage('FAQ');
}
];