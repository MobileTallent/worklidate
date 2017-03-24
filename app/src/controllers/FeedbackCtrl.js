'use strict';
module.exports = [
    '$scope','$ionicModal','$rootScope','Firebase','$ionicPopup','Analytics',function($scope,$ionicModal,$rootScope,Firebase,$ionicPopup,Analytics) {
$rootScope.checkLogin();
 $ionicModal.fromTemplateUrl('create_ticket.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
 $scope.openNewTicket=function()
 {
 	$scope.modal.show();
 	$scope.data.type="Public";
 }
 	var get_ticket_ref = firebase.database().ref("/feedbackTicketsQuestionPublic");
 	get_ticket_ref.on("value", function(ticketsQuestion) {
	 $scope.usertickets=[];
	 for(var key in ticketsQuestion.val())
	 {
	 var d=ticketsQuestion.val()[key];
	 d.id=key;
	 $scope.usertickets.push(d);
	 
	 }
	 if(!$scope.$$phase) {
 		$scope.$apply();
 		
		}
		 });
	var get_ticket_ref = firebase.database().ref("/feedbackTicketsQuestionPrivate").orderByChild('userid').equalTo(JSON.parse(window.localStorage.getItem('info')).uid);
 	get_ticket_ref.on("value", function(ticketsQuestionPrivate) {
	 $scope.userPrivateTickets=[];
	 for(var key in ticketsQuestionPrivate.val())
	 {
	 var d=ticketsQuestionPrivate.val()[key];
	 d.id=key;
	 $scope.userPrivateTickets.push(d);
	 
	 }
	 if(!$scope.$$phase) {
 		$scope.$apply();
 		
		}
 });

 $scope.data=[];
$scope.createTicket=function()
{
	
	if($scope.data.ticketIssue)
	{

	if($scope.data.type=="Private")
		var ref = firebase.database().ref("/feedbackTicketsQuestionPrivate");
	else
		var ref = firebase.database().ref("/feedbackTicketsQuestionPublic");

		var params={};
		params.publishAt=new Date();
		
		params.issue=$scope.data.ticketIssue;
		params.status='open';
		params.feedback=$scope.data.feedback;
		params.userid=JSON.parse(window.localStorage.getItem('info')).uid;
		 var new_data=JSON.parse(angular.toJson(params));
		
		ref.push(new_data);
		$ionicPopup.alert({
        title: 'Worklidate',
        content: 'Thank you for getting in touch!.\n We try to respond as soon as possible, so one of our Customer Service colleagues will get back to you within a few hours. \n Have a great day ahead!.'
        }).then(function(res) {
         $scope.data=[];
        });
        $scope.modal.hide();
	}
}
 Analytics.trackPage('Feedback');
}
];