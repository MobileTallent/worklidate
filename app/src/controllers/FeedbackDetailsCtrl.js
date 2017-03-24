'use strict';
module.exports = [
  '$scope','$ionicModal','$rootScope','Firebase','$ionicPopup','$stateParams','$location','$window','Analytics', function($scope,$ionicModal,$rootScope,Firebase,$ionicPopup,$stateParams,$location,$window,Analytics) {
$rootScope.checkLogin();
$scope.getComment=function()
{
	var get_ticket_ref = firebase.database().ref("/feedbackTicketsComments/").orderByChild('ticketId').equalTo($stateParams.id);
  	get_ticket_ref.on("value", function(ticketsQuestion) {
 	 $scope.comments=ticketsQuestion.val();
 	 if(!$scope.$$phase) {
 		$scope.$apply();
 		
		}
  	});
}
 if($stateParams.id && $stateParams.type)
 {
 if($stateParams.type=='public')
 	{
 		var get_ticket_ref = firebase.database().ref("/feedbackTicketsQuestionPublic/"+$stateParams.id);
 	  	get_ticket_ref.on("value", function(ticketsQuestion) {
 	 	 $scope.ticketdetails=ticketsQuestion.val();
 	 	 if(ticketsQuestion.val())
 	 	 	$scope.getComment();

 	 	 if(!$scope.$$phase) {
 	 		$scope.$apply();
 	 		
 			}
 	  	});
 	  }

 	  if($stateParams.type=='private')
 	{
 		var get_ticket_ref = firebase.database().ref("/feedbackTicketsQuestionPrivate/"+$stateParams.id);
  	
 	  	get_ticket_ref.on("value", function(ticketsQuestion) {
 	 	 $scope.ticketdetails=ticketsQuestion.val();
 	 	 if(ticketsQuestion.val())
 	 	 	$scope.getComment();

 	 	 if(!$scope.$$phase) {
 	 		$scope.$apply();
 	 		
 			}
 	  	});
 	  }
 if($stateParams.type=='faq')
 	{
 		var get_ticket_ref = firebase.database().ref("/faq/"+$stateParams.id);
  	
 	  	get_ticket_ref.on("value", function(ticketsQuestion) {
 	 	 $scope.ticketdetails=ticketsQuestion.val();
 	 	 if(ticketsQuestion.val())
 	 		 $scope.getComment();
 	 	 if(!$scope.$$phase) {
 	 		$scope.$apply();
 	 		
 			}
 	  	});
 	  }

  	
 }
 $scope.data=[];
$scope.send=function()
{
	
	if($scope.data.message){

		var ref = firebase.database().ref("/feedbackTicketsComments");
		var params={};
		params.publishAt=new Date();
		params.comment=$scope.data.message;
		params.userid=JSON.parse(window.localStorage.getItem('info')).uid;
		params.ticketId=$stateParams.id;
		var new_data=JSON.parse(angular.toJson(params));
		ref.push(new_data);
		
        
	}
}
$scope.deleteTicket=function()
{
  var confirm=$window.confirm("Really want to delete it?");
  if(confirm){
	if($stateParams.id && $stateParams.type=='public')
 	{
 		var rm_ticket_ref = firebase.database().ref("/feedbackTicketsQuestionPublic/"+$stateParams.id);
 	  	rm_ticket_ref.remove();
 	  	$location.path('/app/feedback');
 	  }

 	  if($stateParams.id && $stateParams.type=='private')
 	{
 		var rm_ticket_ref = firebase.database().ref("/feedbackTicketsQuestionPrivate/"+$stateParams.id);
  		rm_ticket_ref.remove();
  		$location.path('/app/feedback');
 	  	
 	  }
}
}
 Analytics.trackPage('Feedback_Details');
}
];