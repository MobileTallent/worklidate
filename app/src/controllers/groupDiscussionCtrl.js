'use strict';
module.exports = [
    '$scope','$rootScope','$ionicLoading','$location','$stateParams','$ionicPopup',function($scope,$rootScope,$ionicLoading,$location,$stateParams,$ionicPopup) {
 $rootScope.checkLogin();
$scope.groupId=$stateParams.id;
$rootScope.inviteMember=function()
{
  $location.path("/app/groupinvite/"+$scope.groupId);
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
        if($scope.group.admin_userid==JSON.parse(window.localStorage.getItem('info')).uid || $scope.group.owner_userid==JSON.parse(window.localStorage.getItem('info')).uid){
              $rootScope.showManageTopicOption=true;
              }
              else
              {
              $rootScope.showManageTopicOption=false;
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

}
];