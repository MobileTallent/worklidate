'use strict';
module.exports = [
    '$scope','Firebase','$rootScope','$ionicLoading','$stateParams','$firebaseObject','$location','$ionicActionSheet','Analytics', function($scope,Firebase,$rootScope,$ionicLoading,$stateParams,$firebaseObject,$location,$ionicActionSheet,Analytics){
$rootScope.checkLogin();
$scope.inboxUnreadCount=0;
$scope.contractUnreadMessageCount=[];
$scope.addContractUnreadMessageCount=function(message,lastKey)
{
  if(message.status=='unread')
  {
    if(!$scope.contractUnreadMessageCount[lastKey])
    {
     $scope.contractUnreadMessageCount[lastKey]="1";
     $scope.contractUnreadMessageCount.push(lastKey);
     
    }
  }
}
 if(window.localStorage.getItem('info'))
        {
$scope.loggedUser=JSON.parse(window.localStorage.getItem('info')).uid;
 	var ref = firebase.database().ref('/inbox/'+$scope.loggedUser);
	ref.on("value", function(inbox) {
	$scope.inboxdata=inbox.val();
	for(var key in $scope.inboxdata)
      if($scope.inboxdata[key].status=='unread')
        $scope.inboxUnreadCount=parseInt($scope.inboxUnreadCount)+1;

	if(!$scope.$$phase) {
 		$scope.$apply();
		}
	
});
	$scope.contract=[];
	var myRootRef_a = firebase.database().ref('/contracts/').orderByChild("talent_id").equalTo($scope.loggedUser);
    myRootRef_a.on("value", function(contract) {
      
    	for(var key in contract.val())
    		{
    	    var d=contract.val()[key];
    	    d.id=key;
          d.publishAt=new Date(contract.val()[key].publishAt).getTime();

    	    d.c_type_role='talent';
    	    d.c_type='contract';
    	    		$scope.contract.push(d);
    	    	}
    });
    var myRootRef_a = firebase.database().ref('/jobproposals/').orderByChild("talent_id").equalTo($scope.loggedUser);
    myRootRef_a.on("value", function(contract) {
    	for(var key in contract.val())
    		{
    	    var d=contract.val()[key];
    	    d.id=key;	
          d.publishAt=new Date(contract.val()[key].publishAt).getTime();
    	     d.c_type_role='talent';	
    	     d.c_type='proposal';
    	    		$scope.contract.push(d);
    	    	}
    });
    var myRootRef_a = firebase.database().ref('/contracts/').orderByChild("employer_id").equalTo($scope.loggedUser);
    myRootRef_a.on("value", function(contract) {
    	for(var key in contract.val())
    		{

    	    var d=contract.val()[key];
    	    d.id=key;
          d.publishAt=new Date(contract.val()[key].publishAt).getTime();
    	     d.c_type_role='employer';
    	     d.c_type='contract';	

    	    		$scope.contract.push(d);
    	    	}
    });
    var myRootRef_a = firebase.database().ref('/jobproposals/').orderByChild("employer_id").equalTo($scope.loggedUser);
    myRootRef_a.on("value", function(contract) {
    	for(var key in contract.val())
    		{
    	    var d=contract.val()[key];
    	    d.id=key;	
    	     d.c_type_role='employer';	
           d.publishAt=new Date(contract.val()[key].publishAt).getTime();
    	     d.c_type='proposal';
    	    		$scope.contract.push(d);
    	    	}
    });
  }
    $scope.openContract=function(row,lastKey)
    {
    	
    	if(row.c_type=='contract')
    	{

        
        var ref_unread = firebase.database().ref('/contracts/'+row.id+'/message/'+lastKey);
        ref_unread.once("value",function(message){
        if(message.val())
          {
            if(message.val().status=='unread')
            {
              ref_unread.update({status:'read'});
            }
           
          }
          
        });
    		if(row.c_type_role=='employer')
	    	{
	    		$location.path('/app/contract/details/emp/'+row.id);
	    	}
	    	if(row.c_type_role=='talent')
	    	{
	    		$location.path('/app/contract/details/'+row.id);
	    	}
    	}
    	if(row.c_type=='proposal')
    	{
        
         var ref_unread = firebase.database().ref('/jobproposals/'+row.id+'/message/'+lastKey);
        ref_unread.once("value",function(message){
        if(message.val())
          {
            if(message.val().status=='unread')
            {
              ref_unread.update({status:'read'});
            }
           
          }
          
        });

    		if(row.c_type_role=='employer')
	    	{
          
          if(row.message[lastKey].message=='New proposal received')
          {
            if(row.message[lastKey].jobid)
            {
              $location.path('/app/proposallist/'+row.message[lastKey].jobid);
            }
            else
            {
              $location.path('/app/proposaldetails/'+row.id);
            }
          }
          else
          $location.path('/app/proposaldetails/'+row.id);

	    		

	    	}
	    	if(row.c_type_role=='talent')
	    	{
	    		$location.path('/app/proposal/details/'+row.id);
	    	}
    	}
    }
$scope.inboxOpen=function(id,data)
{
	
	if(data.type=='chat')
	{
		$location.path('/app/chat/'+data.sender);
		var ref = firebase.database().ref('/inbox/'+$scope.loggedUser+'/'+id);
		ref.update({status:'read'});
	
	var ref_check = firebase.database().ref('/notification/'+$scope.loggedUser);
	ref_check.orderByChild('sender').equalTo(data.sender).once("value",function(notify){

		if(notify.val())
		{
			for(var key in notify.val())
			if(notify.val()[key].type=="chat")
			{	
				var ref = firebase.database().ref('/notification/'+$scope.loggedUser+'/'+key);
				ref.remove();
			}
		}
		
	});

	}
}
$scope.deleteNotification=function(id)
{
if(id)
 {
  var ref = firebase.database().ref('/notification/'+JSON.parse(window.localStorage.getItem('info')).uid+'/'+id).update({delete:'true'});

  }
}
$scope.inboxMoreOptions=function(id,data)
{
if(data.type=='chat')
	{
	// Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       ],
     destructiveText: 'Delete',
     cancelText: 'Cancel',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
       return true;
     },
     destructiveButtonClicked:function()
     {
	     
	     if(id){
	     	     var ref_delete_chat = firebase.database().ref('/userschat/'+$scope.loggedUser+'/chat/'+data.sender);
	     	     ref_delete_chat.remove();
	     	     var ref_1 = firebase.database().ref('/inbox/'+$scope.loggedUser+'/'+id);
	     		 ref_1.remove();
			     var ref_check = firebase.database().ref('/notification/'+$scope.loggedUser);
					ref_check.orderByChild('sender').equalTo(data.sender).once("value",function(notify){

						if(notify.val())
						{
							for(var key in notify.val())
							if(notify.val()[key].type=="chat")
							{	
								var ref = firebase.database().ref('/notification/'+$scope.loggedUser+'/'+key);
								ref.remove();
							}
						}
						
					});
	     }

	      return true;
	     }
   });
}
  
}
 Analytics.trackPage('Inbox');
}
];