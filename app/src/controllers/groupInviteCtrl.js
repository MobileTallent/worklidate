'use strict';
module.exports = [
    '$scope', function($scope,$ionicLoading,$rootScope,$stateParams,Analytics) {
 $rootScope.checkLogin();
$scope.groupId=$stateParams.id;
 //setup before functions
var typingTimer;                //timer identifier
var doneTypingInterval = 500;  //time in ms, 5 second for example
var $input = $('#myInput_1');

//on keyup, start the countdown
$input.on('keyup', function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(function(){

  $scope.searchuser();
  }, doneTypingInterval);
});

//on keydown, clear the countdown 
$input.on('keydown', function () {
  clearTimeout(typingTimer);
});

$scope.inviteMember=function(userid)
{
		if($scope.groupId){
	 $ionicLoading.show({
			      template: 'Inviting...'
			    });
        		var fredRef = firebase.database().ref('/groups/'+$scope.groupId+'/invites');
       			 fredRef.orderByChild("userid").equalTo(userid).once("value", function(snapshot) {
			    
			  	
			  	if(snapshot.val()==null)
			  	{
			  		fredRef.push({userid:userid});
			  		var fredRef1 = firebase.database().ref('/users/'+userid+'/groups_invitaion');
			  		fredRef1.push({groupid:$scope.groupId});
			  		$scope.searchuser();
			  		 $ionicLoading.hide();
             var sendDate=new Date();
              var notification_data=JSON.parse(angular.toJson({date:sendDate,type:'group_invitation',sender:$rootScope.loggedUserId,senderName:$rootScope.userdata.name,status:'unread',message:$rootScope.userdata.name+" sent you an invitation to join group."}));
              var ref = firebase.database().ref('/notification/'+userid);
              ref.push(notification_data);
			  		 	alert("Invitation sent.");

             
			  	}
			  	else{ 
			  	$ionicLoading.hide();
			  	alert("Already sent");
			  	}
		  	
		   });
		   }

}
$scope.typeof=function(data)
{
	return (typeof(data)).toString();
}
$scope.search=[];


  	 $scope.displayNotFound=false;
 $scope.searchuser=function()
 {
 $scope.displayNotFound=false;
  delete $scope.searched_result;
   $scope.searched_result=[];
  if($scope.search.groupsearch.length>0){
  
  for(key in $rootScope.data_for_search.users)
  {
    if($rootScope.data_for_search.users[key].title.indexOf($scope.search.groupsearch.toLowerCase())>-1)
    $scope.searched_result.push($rootScope.data_for_search.users[key]);

    $scope.$apply();


  }
   }
   else
   {
    $scope.searched_group_result=[];
    $scope.displayNotFound=false;
   }
}
 Analytics.trackPage('Groupt_Invitation');
}
];