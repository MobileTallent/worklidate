'use strict';
module.exports = [
    '$scope','$rootScope','$ionicLoading','$location','$stateParams','$ionicModal','$ionicPopup','$ionicActionSheet','$http','Analytics', function($scope,$rootScope,$ionicLoading,$location,$stateParams,$ionicModal,$ionicPopup,$ionicActionSheet,$http,Analytics) {
$rootScope.checkLogin();
 if(document.getElementById('group_projects'))
 document.getElementById('group_projects').style.display="block";
 if(document.getElementById('group_topics_discussion'))
document.getElementById('group_topics_discussion').style.display="none";

$scope.groupId=$stateParams.id;
$rootScope.showManageTopicOption=false;
$rootScope.inviteMember=function()
{
  $location.path("/app/groupinvite/"+$scope.groupId);
}
var myPopup = $ionicModal.fromTemplateUrl('templates/kickout_member.html', {
    scope: $scope,
    animation: 'slide-in-up',
    
  }).then(function(modal) {
    $scope.modal = modal;
  });
  var myPopup1 = $ionicModal.fromTemplateUrl('templates/grouprules.html', {
    scope: $scope,
    animation: 'slide-in-up',
    
  }).then(function(modal) {
    $scope.rulesmodal = modal;
  });
  var myPopup2 = $ionicModal.fromTemplateUrl('templates/manage_group_topic.html', {
    scope: $scope,
    animation: 'slide-in-up',
    
  }).then(function(modal) {
    $scope.manageTopicmodal = modal;
  });
  var myPopup3 = $ionicModal.fromTemplateUrl('templates/group_admin.html', {
    scope: $scope,
    animation: 'slide-in-up',
    
  }).then(function(modal) {
    $scope.groupAdmin = modal;
  });
 // Triggered on a button click, or some other target
$rootScope.kickOutMember = function() {

  $scope.modal.show();
  
 };
 $rootScope.showAdminPopup = function() {

  $scope.groupAdmin.show();
  
 };
 $rootScope.showRules = function() {

  $scope.rulesmodal.show();
  
 };
  $rootScope.manageGroupTopic = function() {

  $scope.manageTopicmodal.show();

 };
 $rootScope.deleteTopic=function(id)
 {
 if(id)
 {
    var fredRef =  firebase.database().ref('/groups/'+$scope.groupId+'/topics/'+id);
     fredRef.remove();
 }

 }
  $rootScope.deleteComment=function(comment_id,id)
 {
 if(id && comment_id)
 {
    var fredRef =  firebase.database().ref('/groups/'+$scope.groupId+'/topics/'+id+'/comments/'+comment_id);
     fredRef.remove();
 }

 }
 $rootScope.makeAdmin=function(id,memberuserid)
 {
 if(id && memberuserid){
  var ref = firebase.database().ref('/groups/'+$scope.groupId+'/admin/');
                  ref.push({
                   userid:memberuserid
                 }); 
                 }
 }
 $rootScope.removeAdmin=function(id,memberuserid,admindata)
 {
 if(id && memberuserid){
   for(var key in admindata){
   if(admindata[key].userid==memberuserid)
   {
     var ref_Admin_remove = firebase.database().ref('/groups/'+$scope.groupId+'/admin/'+key);
                    ref_Admin_remove.remove();
                   }
   }
   }
 }
 
$rootScope.kickout=function(id,userid)
{
  if($scope.groupId){
 $ionicLoading.show({
            template: 'Removing...'
          });
       
      setTimeout(function(){
          var fredRef =  firebase.database().ref('/groups/'+$scope.groupId+'/members/'+id);
          var fredRef1 =  firebase.database().ref('/users/'+userid+'/groups');
            fredRef.remove(function(error) {
              if (error) {
              
             
              $ionicLoading.hide();
                console.log('Synchronization failed');
              } else {
              fredRef1.orderByChild("groupid").equalTo($scope.groupId).once("value", function(snapshotg){
    
                for(var key in snapshotg.val()){
              
              var fredRef2 =  firebase.database().ref('/users/'+userid+'/groups/'+key);
              fredRef2.remove();
            }
              });

                $ionicLoading.hide();
                console.log('Synchronization succeeded');
                $scope.searchgroup();
              }
            });
            },100);
        }
      
}
$scope.loggeduserIsFollower=false;
if($scope.groupId)
{
$ionicLoading.show({
			      template: 'Loading...'
			    });
    var ref = firebase.database().ref("/groups/"+$scope.groupId);
        ref.on("value", function(groups) {
       
        $scope.group=groups.val();
        $scope.$apply();
        $rootScope.showManageTopicOption=false;
        for(var admin in $scope.group.admin)
        {
          
          if($scope.group.admin[admin].userid==JSON.parse(window.localStorage.getItem('info')).uid)
          {
             $rootScope.showManageTopicOption=true;
          }
        }
              if( $scope.group.owner_userid==JSON.parse(window.localStorage.getItem('info')).uid){
                $rootScope.showAdminOption=true;
              }
              else
              {
              $rootScope.showAdminOption=false;
              }
          $ionicLoading.hide();
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
          $ionicLoading.hide();
        });
    var fredRef = firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/groups_follow');
             fredRef.orderByChild("groupid").equalTo($scope.groupId).on("value", function(snapshot) {
     
          if(snapshot.val()==null)
          {
            $scope.loggeduserIsFollower=false;
          }
          else{ 
          $scope.loggeduserIsFollower=true;
          }
        
       });
}
$scope.discussionProject=function(groupid)
{
if(document.getElementById('group_projects'))
 document.getElementById('group_projects').style.display="none";
 if(document.getElementById('group_topics_discussion'))
 document.getElementById('group_topics_discussion').style.display="block";
}
$scope.getMembersProject=function(group)
{
if(document.getElementById('group_projects'))
 document.getElementById('group_projects').style.display="block";
 if(document.getElementById('group_topics_discussion'))
document.getElementById('group_topics_discussion').style.display="none";

$rootScope.members_projects=[];
for(var key in group.members)
{
$ionicLoading.show({
            template: 'Loading...'
          });
    var ref = firebase.database().ref("/projects");
        ref.orderByChild('userid').equalTo(group.members[key].userid).on("value", function(projects) {
       $ionicLoading.hide();
        if(projects.val()!=null)
        for(var key in projects.val())
        {
         var proj=projects.val()[key];
         proj.id=key;
          $rootScope.members_projects.push(proj);
        }
        
         
        }, function (errorObject) {
        $ionicLoading.hide();
          console.log("The read failed: " + errorObject.code);
          
        });
}
}
$scope.followgroup=function(groupid)
{
  if(groupid){
   $ionicLoading.show({
            template: 'Loading...'
          });
          setTimeout(function(){
            var fredRef = firebase.database().ref('/groups/'+groupid+'/followers/');
             fredRef.orderByChild("userid").equalTo(JSON.parse(window.localStorage.getItem('info')).uid).once("value", function(snapshot) {
          
          
          if(snapshot.val()==null)
          {
            fredRef.push({userid:JSON.parse(window.localStorage.getItem('info')).uid});
            var fredRef1 = firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/groups_follow');
            fredRef1.push({groupid:groupid});
            
             $ionicLoading.hide();

          }
          else{ 
          $ionicLoading.hide();
          alert("Already Follower");
          }
        
       });
},100);
        
      }
}
$scope.unfollowGroup=function(groupid)
{
if(groupid){
 $ionicLoading.show({
            template: 'Loading...'
          });
        var fredRef = firebase.database().ref('/groups/'+groupid+'/followers');
        fredRef.orderByChild("userid").equalTo(JSON.parse(window.localStorage.getItem('info')).uid).once("value", function(snapshot) {
        var member_id=0;
        if(snapshot.val()!=null)
        {
         for(var key in snapshot.val()){
        member_id=key;
        
      }
      setTimeout(function(){
          var fredRef =  firebase.database().ref('/groups/'+groupid+'/followers/'+member_id);
          var fredRef1 =  firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/groups_follow');
            fredRef.remove(function(error) {
              if (error) {
              
             
              $ionicLoading.hide();
                console.log('Synchronization failed');
              } else {
              fredRef1.orderByChild("groupid").equalTo(groupid).once("value", function(snapshotg){
    
                for(var key in snapshotg.val()){
              
              var fredRef2 =  firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/groups_follow/'+key);
              fredRef2. remove();
            }
              });

                $ionicLoading.hide();
                console.log('Synchronization succeeded');
                
              }
            });
            },100);
        }
        
       });

        
      }
}
$scope.createTopic=function()
{
  $scope.data = {};

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<p>Topic</p> <input type="text" ng-model="data.title"><p>Description</p><input type="text" ng-model="data.description">',
    title: 'Create Topic',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Create</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.title) {
            //don't allow the user to close unless he enters title
            e.preventDefault();
          } else {
            return $scope.data;
          }
        }
      }
    ]
  });

  myPopup.then(function(res) {
    if(res)
    {

  var fredRef1 = firebase.database().ref('/groups/'+$scope.groupId+'/topics');
            fredRef1.push(res);  
           
    }

  });

 
            
}

$scope.comment=function(topicid)
{
  $scope.comment_data = {};

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<input type="text" ng-model="comment_data.comment">',
    title: 'Enter comment',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Comment</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.comment_data.comment) {
            //don't allow the user to close unless he enters title
            e.preventDefault();
          } else {
            return $scope.comment_data.comment;
          }
        }
      }
    ]
  });

  myPopup.then(function(res) {
    if(res)
    {
        var s_data= {userid:JSON.parse(window.localStorage.getItem('info')).uid,comment:$scope.comment_data.comment,publishAt:new Date()};
   
        var new_data=JSON.parse(angular.toJson(s_data));
        var fredRef1 = firebase.database().ref('/groups/'+$scope.groupId+'/topics/'+topicid+'/comments');
        fredRef1.push(new_data);
        setTimeout(function(){
        s_data.groupid=$scope.groupId;
        s_data.topicid=topicid;
         s_data.type='group';
        var new_s_data=JSON.parse(angular.toJson(s_data));
        var fredRef2 = firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/comments/');
        fredRef2.push(new_s_data);    
           },100);
    }

  });

 
            
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
   Analytics.trackPage('Group_Details');
}
];