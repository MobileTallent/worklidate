'use strict';
module.exports = [
    '$scope','$window','$ionicPopup','$state','$location', '$timeout','$rootScope','$ionicLoading','$ionicModal','Upload','$ionicActionSheet','$http','Analytics', function($scope,$window, $ionicPopup,$state,$location, $timeout,$rootScope,$ionicLoading,$ionicModal,Upload,$ionicActionSheet,$http,Analytics) {
$ionicLoading.show({
			      template: 'Loading...'
			    });
$rootScope.checkLogin();
$scope.onFileSelect = function (file) {

  if(file[0])
  {
 
  $scope.filesdata=file[0];
   }
   }
   
     var ref = firebase.database().ref("/groups");
        ref.orderByChild('owner_userid').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).on("value", function(groups) {
        
        $rootScope.user_groups=groups.val();
      
          $ionicLoading.hide();
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
          $ionicLoading.hide();
        });

        var ref = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/groups");
        ref.on("value", function(groups) {
        
        $rootScope.user_joined_groups=[];
         
        for(var key in groups.val()){
        
        if(key)
                {

               		
                			if(groups.val()[key].groupid){
							  var fredRef = firebase.database().ref('/groups/'+groups.val()[key].groupid);
						       fredRef.once("value", function(snapshot) {
						      
						       if(snapshot.val()!=null)
                                {

                                var data=snapshot.val();
                                data.groupid=snapshot.key;
                               	 	$rootScope.user_joined_groups.push(data);
                                	
                                }
                            
						       });
						       }
                			}
                }
      
          $ionicLoading.hide();
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
          $ionicLoading.hide();
        });


var myPopup = $ionicModal.fromTemplateUrl('templates/create_group.html', {
    scope: $scope,
    animation: 'slide-in-up',
    
  }).then(function(modal) {
    $scope.modal = modal;
  });
 // Triggered on a button click, or some other target
$scope.createGroupPopup = function() {
  $scope.data = {};
  $scope.modal.show();
  
 };

 $scope.createGroup=function(data){

 if(data)
    {
$ionicLoading.show({
            template: 'Loading...'
          });
        data.image='';

        
      data.publishAt=new Date();
            data.portfolio=0;
            data.projects=0;
        var new_data=JSON.parse(angular.toJson(data));
        
        new_data.owner_userid=JSON.parse(window.localStorage.getItem('info')).uid;
       
        var myRootRef = firebase.database().ref('/groups');
        var collectionRef = myRootRef.push(new_data);
        var myRootRef_search = firebase.database().ref('/search/groups');
        var category=[];
        if(data.interested_categories)
        data.interested_categories.forEach(function(entry){
          category.push(entry.name);
        });
       
       var categoryid=[];
              if(data.interested_categories)
                data.interested_categories.forEach(function(entry){
                  categoryid.push(entry.id);
                });
                
        setTimeout(function(){
         
        var collectionRef_search = myRootRef_search.push({group_id:collectionRef.key,title:(data.grouptitle).toLowerCase(),category:category.join(),location:data.location});

        	var fredRef = firebase.database().ref('/groups/'+collectionRef.key+'/members');
        	fredRef.push({userid:JSON.parse(window.localStorage.getItem('info')).uid});
            var ref_admin = firebase.database().ref('/groups/'+collectionRef.key+'/admin/');
                  ref_admin.push({
                   userid:JSON.parse(window.localStorage.getItem('info')).uid
                 });
        	if($scope.filesdata)
        	{

        		Upload.upload({
			            url: $rootScope.serverURL+'/uploadfile.php?type=groups',
			           data: {file: $scope.filesdata,id:collectionRef.key},
			        }).then(function (resp) {
			       $ionicLoading.hide();
                 var ref = firebase.database().ref();
                 ref.child("groups").child(collectionRef.key).update({
                  image:$rootScope.serverURL+'/upload/groups/'+collectionRef.key
                }); 
                  $ionicLoading.hide();
			        }, function (resp) {
			            console.log('Error status: ' + resp.status);
			           
  $ionicLoading.hide();
			        }, function (evt) {
			            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			            
			        });
        	}
          else
          {
            $ionicLoading.hide();
          }
        },100);
         $scope.modal.hide();
    }

 }

 

//setup before functions
var typingTimer;                //timer identifier



if($rootScope.data_for_search)
{
$scope.searched_group_result=[];
   for(var key in $rootScope.data_for_search.groups)
  {
    $scope.searched_group_result.push($rootScope.data_for_search.groups[key]);
  }
  
} 
else
{
  var ref = firebase.database().ref("/search/groups");
    ref.once("value", function(snapshot) {
        $rootScope.data_for_search=snapshot.val();
        $rootScope.data_for_search_user_array=[];
        $rootScope.data_for_search_groups_array=[];
        $rootScope.data_for_search_projects_array=[];
        $scope.searched_group_result=[];
         for(var key in snapshot.val())
        {
          $scope.searched_group_result.push(snapshot.val()[key]);
        }
       
    });
} 
 $scope.search=[];
 

$scope.deleteGroup=function(id)
{
	
 
  if(id){
  var confirm=$window.confirm("Really want to delete it?");
  if(confirm){
  
    $ionicLoading.show({
              template: 'Deleting...'
            });
          var fredRef = firebase.database().ref('/groups/'+id);
          fredRef.remove(function(error) {
            if (error) {
              console.log('Synchronization failed');
  
               $ionicLoading.hide();
            } else {
            var fredRef = firebase.database().ref('/search/groups/').orderByChild('group_id').equalTo(id);
               fredRef.once("value",function(group){

                if(group.val())
                {
                  for(var key in group.val())
                  {
                   
                    var fredRef = firebase.database().ref('/search/groups/'+key);
                    fredRef.remove();
                  }
                }
               });
              console.log('Synchronization succeeded');
               $ionicLoading.hide();
            }
          });
          }
      }
 
}

$scope.isMember=function(members)
{
var logged_userid=JSON.parse(window.localStorage.getItem('info')).uid;
	for(var key in members){
		if(members[key].userid==logged_userid)
		return true;
	}
	
}
$scope.leaveGroup=function(groupid)
{
if(groupid){
 $ionicLoading.show({
			      template: 'Leaving...'
			    });
        var fredRef = firebase.database().ref('/groups/'+groupid+'/members');
        fredRef.orderByChild("userid").equalTo(JSON.parse(window.localStorage.getItem('info')).uid).once("value", function(snapshot) {
      	var member_id=0;
		  	if(snapshot.val()!=null)
		  	{
		  	 for(var key in snapshot.val()){
				member_id=key;
				
			}
			setTimeout(function(){
		  		var fredRef =  firebase.database().ref('/groups/'+groupid+'/members/'+member_id);
		  		var fredRef1 =  firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/groups');
			      fredRef.remove(function(error) {
			        if (error) {
			        
			       
			        $ionicLoading.hide();
			          console.log('Synchronization failed');
			        } else {
			        fredRef1.orderByChild("groupid").equalTo(groupid).once("value", function(snapshotg){
   	
			        	for(var key in snapshotg.val()){
							
							var fredRef2 =  firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/groups/'+key);
							fredRef2. remove();
						}
			        });

			          $ionicLoading.hide();
			          console.log('Synchronization succeeded');
			          //$scope.searchgroup();
			        }
			      });
			      },100);
		  	}
		  	
		   });

      	
      }
}
$scope.moreoptions=function(id,data)
    {
      // Show the action sheet
       var hideSheet = $ionicActionSheet.show({
         buttons: [
          { text: 'Translate' },
           ],
      
         buttonClicked: function(index) {
      
          if(index==0)
          {
          var text=$('#'+id).html();
        
           $('#'+id).html("<img src='img/smallloading.gif' style='height:16px;width:28px'/>");
         
          var url=window.location.origin+'/translation.php';

            $http({
                          method: 'POST',
                          url: url,
                           data: { text:text},
                           headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                        }).then(function successCallback(response) {
                      
                           $('#'+id).html(response.data.text);

                          }, function errorCallback(response) {
                          console.log(response);
                          });
          }
          
           return true;
         }
       });
  }
   Analytics.trackPage('Groups');
}
];
