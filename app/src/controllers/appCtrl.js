'use strict';

/**
 * @ngdoc function
 * @name Worklidate.controller:HomeController
 * @description
 * # HomeController
 */
module.exports = [
    '$scope', '$ionicModal', '$timeout','$ionicPopover', '$rootScope','$location','$ionicHistory','Firebase','$state','$window','$filter','$ionicLoading',

     function($scope, $ionicModal, $timeout,$ionicPopover, $rootScope,$location,$ionicHistory,Firebase,$state,$window,$filter,$ionicLoading) {
$scope.loginData = {};

$rootScope.firebaseurl=app_config.databaseURL;
$rootScope.serverURL=app_config.serverURL;
 if(window.localStorage.getItem('info')) {
    $rootScope.loggedUserId=JSON.parse(window.localStorage.getItem('info')).uid;
}
$scope.animation = 'slide-in-up';
  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope,
    animation: $scope.animation
  }).then(function(popover) {
    $scope.popover = popover;
  });

 setInterval(function(){
  $rootScope.currentDate=new Date();
 // $rootScope.serverTime=serverTime;
 $rootScope.serverTime=new Date();
},1000);
$scope.closePopover = function() {
    $scope.popover.hide();
  };
 $scope.$on('$stateChangeStart', 
             function(event, toState, toParams, fromState, fromParams){ 
    $scope.closePopover();
  });

   $rootScope.checkLogin=function()
  {
    if(window.localStorage.getItem('info')) {
           if($location.path()=='/app/login')
              $state.go('app.mainpage');
              $rootScope.loggedUserId=JSON.parse(window.localStorage.getItem('info')).uid;
            }else{
            if($location.path()!='/app/login' && $location.path()!='/app/signup' && $location.path()!='/app/forgotpassword')
             $state.go('app.login');
          }
  }
$rootScope.skills=[];
for(var key in skills)
{
  if(skills[key]){
    var d=skills[key];
    d.id=key;
    $rootScope.skills.push(d);
  }
 }
 
 
$scope.groupdetails=function(groupid){
  $location.path('/app/groupdetails/'+groupid);
 }

 $scope.addproject=function(){
  $location.path('/app/addproject');
 }

  $scope.postproject=function(){
  $location.path('/app/jobpost');
 }




 $scope.joinGroup=function(groupid)
{
  if(groupid){
   $ionicLoading.show({
            template: 'Joining...'
          });
          setTimeout(function(){
            var fredRef = firebase.database().ref('/groups/'+groupid+'/members/');
            
             if(window.localStorage.getItem('info'))
         {
             fredRef.orderByChild("userid").equalTo(JSON.parse(window.localStorage.getItem('info')).uid).once("value", function(snapshot) {
          
          
          if(snapshot.val()==null)
          {
            var fredRef_invite = firebase.database().ref('/groups/'+groupid+'/invites');
            fredRef_invite.once("value", function(invite) {
              for(var k in invite.val())
              {
                  if(invite.val()[k].userid==(JSON.parse(window.localStorage.getItem('info')).uid))
                  {
                      var fredRef_invite_remove = firebase.database().ref('/groups/'+groupid+'/invites/'+k);
                      fredRef_invite_remove.remove();
                  }
              }
            });

            var fredRef_user_invite = firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/groups_invitaion');
            fredRef_user_invite.once("value", function(invite) {
              for(var k in invite.val())
              {
                  if(invite.val()[k].groupid==groupid)
                  {
                      var fredRef_user_invite_remove = firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/groups_invitaion/'+k);
                      fredRef_user_invite_remove.remove();
                  }
              }
            });

            fredRef.push({userid:JSON.parse(window.localStorage.getItem('info')).uid});
            var fredRef1 = firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/groups');
            fredRef1.push({groupid:groupid});
            //$scope.searchgroup();
             $ionicLoading.hide();

          }
          else{ 
          $ionicLoading.hide();
          alert("Already joined");
          }
        
       });
           }
},100);
        
      }
}
$scope.readNotification=function(row)
{
if(row.id)
 {
  var ref = firebase.database().ref('/notification/'+JSON.parse(window.localStorage.getItem('info')).uid+'/'+row.id);
  ref.update({'status':'read'})
  }
  if(row.newProposal)
 {
   $location.path('/app/proposallist/'+row.jobid);
 }
}
$scope.rejectInvitation=function(groupid)
{
   if(window.localStorage.getItem('info'))
        {
  var fredRef_invite = firebase.database().ref('/groups/'+groupid+'/invites');
            fredRef_invite.once("value", function(invite) {
              for(var k in invite.val())
              {
                  if(invite.val()[k].userid==(JSON.parse(window.localStorage.getItem('info')).uid))
                  {
                      var fredRef_invite_remove = firebase.database().ref('/groups/'+groupid+'/invites/'+k);
                      fredRef_invite_remove.remove();
                  }
              }
            });

            var fredRef_user_invite = firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/groups_invitaion');
            fredRef_user_invite.once("value", function(invite) {
              for(var k in invite.val())
              {
                  if(invite.val()[k].groupid==groupid)
                  {
                      var fredRef_user_invite_remove = firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/groups_invitaion/'+k);
                      fredRef_user_invite_remove.remove();
                  }
              }
            });
          }
}
$rootScope.getInitialUserData=function()
{
   if(window.localStorage.getItem('info'))
 {
   
        var ref = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid);
        ref.on("value", function(snapshot) {
         $rootScope.userdata=snapshot.val();
        
      }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
          
        $ionicLoading.hide();
        });

 var get_notification = firebase.database().ref('/notification/'+JSON.parse(window.localStorage.getItem('info')).uid);
    get_notification.orderByChild('date').on("value", function(notifications) {
     
      $rootScope.notifications=notifications.val();
      $rootScope.unReadNotificationsCount=0;
      $rootScope.unReadNotificationsCount_tab=0;
      for(var key in $rootScope.notifications)
      {
        if($rootScope.notifications[key].status=='unread' && $rootScope.notifications[key].delete!='true')
          $rootScope.unReadNotificationsCount=$rootScope.unReadNotificationsCount+1;
        if($rootScope.notifications[key].status=='unread' && $rootScope.notifications[key].type!='chat' && $rootScope.notifications[key].delete!='true')
          $rootScope.unReadNotificationsCount_tab=$rootScope.unReadNotificationsCount_tab+1;
      }
      if(!$scope.$$phase) {
        $scope.$apply();
        }
    });
}
}
 if(window.localStorage.getItem('info'))
 {
   
       $rootScope.getInitialUserData();
}

$scope.setLang=function(lang)
{
  
  window.localStorage.setItem('lang',lang);
  $location.path('/');
  location.reload();
}
 var ref = firebase.database().ref("/categories");
        ref.orderByChild('name').on("value", function(categories_snapshot) {
        var data=[];
        $rootScope.categories_tree=[];
        data=categories_snapshot.val();
        $rootScope.categoriesObjects=categories_snapshot.val();
         $rootScope.categories=[];
         $rootScope.withoutYellowcategories=[];
         for(var key in data)
         {
         var d=data[key];
            d.id=key;
          if(data[key].parent_id!=0)
          {
            
            $rootScope.categories.push(d);
          }
          if(data[key].parent_id!=0 && data[key].type!=1)
          {
            
            $rootScope.withoutYellowcategories.push(d);
          }
          if(data[key].type!=1){
                    if($rootScope.categories_tree[data[key].parent_id])
                      $rootScope.categories_tree[data[key].parent_id].push(d);
                    else{
                              $rootScope.categories_tree[data[key].parent_id]=[];
                               $rootScope.categories_tree[data[key].parent_id].push(d);
                             }
                             }
        }
      
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
        $scope.logout=function()
        {
            window.localStorage.removeItem('info');
            delete $rootScope.userdata;
            delete $rootScope.loggedUserId;
            firebase.auth().signOut().then(function() {
              window.localStorage.setItem('just_logout','true');
                //$state.go('app.mainpage');
                location.reload();
            }, function(error) {
              window.localStorage.setItem('just_logout','true');
              // $state.go('app.mainpage');
               location.reload();
            });

          
        }
$scope.goto=function(page)
  {
    console.log(page);
    $location.path('/app/'+page);
  }
  $scope.toggleTabs=function(id)
  {
    $('#'+id).toggleClass('open');
  }
  $scope.back=function()
  {
     $ionicHistory.goBack();
  }
   $rootScope.calculateWindowSizes = function(){
      $rootScope.screenHeight = window.screen.height;
      $rootScope.screenWidth = window.screen.width;  
      $rootScope.windowHeight =$(window).height();
               $rootScope.windowWidth =$(window).width();
    };
   $rootScope.calculateWindowSizes();
    var w = angular.element($window);
    w.bind('resize', function () {
           $rootScope.calculateWindowSizes();
           //alert("Resized Images");
    });
  }
];

//.controller('justLoadCtrl', function($scope, $ionicModal, $timeout,$rootScope,$location,$ionicHistory,Firebase,$state,$window,$filter,$ionicLoading) {
//});