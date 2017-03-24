'use strict';
module.exports = [
    '$scope','Firebase','$rootScope','$ionicLoading','Analytics','$stateParams','$firebaseObject','$ionicScrollDelegate','$ionicActionSheet','$http', function($scope,Firebase,$rootScope,$ionicLoading,Analytics,$stateParams,$firebaseObject,$ionicScrollDelegate,$ionicActionSheet,$http) {
$rootScope.checkLogin();
 if(window.localStorage.getItem('info'))
        {
$scope.partner_id=$stateParams.id;
$scope.loggedUser=JSON.parse(window.localStorage.getItem('info')).uid;
$scope.data=[];
var ref = firebase.database().ref('/userschat/'+$scope.loggedUser+'/chat/'+$scope.partner_id);
	ref.orderByChild('date').on("value", function(chat) {
	$scope.chatdata=chat.val();
	if(!$scope.$$phase) {
 		$scope.$apply();
 		
		}
		$scope.$watch('scopeNameOfTheElementThatRepeated', function(newValue, oldValue) {
    $ionicScrollDelegate.scrollBottom(true);
  }, true);
	
});
}

$scope.send=function()
{	
	var sendDate=new Date();
	var new_data=JSON.parse(angular.toJson({message:$scope.data.message,date:sendDate,type:'receiver'}));
	var ref = firebase.database().ref('/userschat/'+$scope.partner_id+'/chat/'+$scope.loggedUser);
	ref.push(new_data);
	var new_data=JSON.parse(angular.toJson({message:$scope.data.message,date:sendDate,type:'sender'}));
	var ref = firebase.database().ref('/userschat/'+$scope.loggedUser+'/chat/'+$scope.partner_id);
	ref.push(new_data);
	var ref_check = firebase.database().ref('/inbox/'+$scope.partner_id);

	var new_data=JSON.parse(angular.toJson({message:$scope.data.message,date:sendDate,type:'chat',sender:$scope.loggedUser,senderName:$rootScope.userdata.name}));
	
	var inbox_data=JSON.parse(angular.toJson({message:$scope.data.message,date:sendDate,type:'chat',sender:$scope.loggedUser,senderName:$rootScope.userdata.name,status:'unread'}));

	ref_check.orderByChild('sender').equalTo($scope.loggedUser).once("value",function(data){

		if(data.val())
		{
			for(var key in data.val())
			if(data.val()[key].type=="chat")
			{	
				var ref = firebase.database().ref('/inbox/'+$scope.partner_id+'/'+key);
				ref.update(inbox_data);
			}
		}
		else
		{
			var ref = firebase.database().ref('/inbox/'+$scope.partner_id);
			ref.push(inbox_data);
		}
	});
	var notification_data=JSON.parse(angular.toJson({date:sendDate,type:'chat',sender:$scope.loggedUser,senderName:$rootScope.userdata.name,status:'unread'}));
	
	var ref = firebase.database().ref('/notification/'+$scope.partner_id);
	ref.push(notification_data);
	
	
	
	$scope.data.message='';
	
}

$scope.chatMoreOptions=function(id,data,chatindex)
{
	// Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
      { text: 'Translate' },
       ],
     destructiveText: 'Delete',
     cancelText: 'Cancel',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {

     	if(index==0)
     	{
     	var text=$('#chat'+chatindex).html();
		
     	 $('#chat'+chatindex).html("<img src='img/smallloading.gif' style='height:16px;width:28px'/>");
     	
     	var url=window.location.origin+'/translation.php';

     		$http({
                      method: 'POST',
                      url: url,
                       data: { text:text},
                       headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }).then(function successCallback(response) {
                  
                       $('#chat'+chatindex).html(response.data.text);

                      }, function errorCallback(response) {
                      console.log(response);
                      });
     	}
     	
       return true;
     },
     destructiveButtonClicked:function()
     {
	     var ref_delete_chat = firebase.database().ref('/userschat/'+$scope.loggedUser+'/chat/'+$scope.partner_id+'/'+id);
	     ref_delete_chat.remove();
	      return true;
	     }
   });

  
}
Analytics.trackPage('Chat');
}
];