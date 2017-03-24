'use strict';
module.exports = [
    '$scope','Firebase','$rootScope', '$state','Analytics','$ionicModal','$ionicPopup', function($scope,Firebase,$rootScope, $state,Analytics,$ionicModal,$ionicPopup) {
  $rootScope.checkLogin();
$scope.userSettings=[];
 $ionicModal.fromTemplateUrl('create_ticket.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
 $scope.openNewTicket=function()
 {
  $scope.modal.show();
 }

 var ref = firebase.database().ref("/categories");
  ref.orderByChild('parent_id').equalTo(0).once("value", function(categories_snapshot) {

     $scope.category_level_1=[];
         for(var key in categories_snapshot.val())
         {
          if(categories_snapshot.val()[key].parent_id==0)
          {
                    var d=categories_snapshot.val()[key];
                    d.id=key;
                    $scope.category_level_1.push(d);
                
              }
         }

         var ref1 = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/interested_categories");
          ref1.once("value",function(interested_categories){
          setTimeout(function(){
          for(var key in interested_categories.val()){
          $scope.userSettings.push(interested_categories.val()[key].id);
             $("#category"+interested_categories.val()[key].id).addClass('checked');
             $("#category"+interested_categories.val()[key].id).removeClass('unchecked');
            }
          if(!$scope.$$phase) {
                    $scope.$apply();
                    }
          },1000);
        });
  });
   $scope.settingBack=function()
 {
    $state.go('app.mainpage');
    location.reload();
 }
$scope.setLanguagePreference=function(lang)
{
  $rootScope.refreshHomePage=true;
  var ref1 = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/languagePreference");
  ref1.set({'languagePreference':lang});
         
}
$scope.getCategories=function(id)
{

	$("#category"+id).toggle('show');
	
}
$scope.markCategory=function(id,cat)
{
$rootScope.refreshHomePage=true;


  if($scope.userSettings.length==0)
      {
      
          $scope.userSettings.push(id);
          $("#category"+id).addClass('checked');
          $("#category"+id).removeClass('unchecked');
          var ref = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/interested_categories");
          var new_data=JSON.parse(angular.toJson(cat));
          ref.push(new_data);
      }
      else
      {
      var push=true;
        $scope.userSettings.forEach(function(entry,index){
       
          if(entry==id){
                $("#category"+id).addClass('unchecked');
                $("#category"+id).removeClass('checked');
                $scope.userSettings.splice(index, 1);
                push=false;
                var ref1 = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/interested_categories").orderByChild('id').equalTo(id).once("value",function(data){
                  for(var k in data.val())
                  {
                  var ref2 = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/interested_categories/"+k)
                 
                    ref2.remove();
                  }
                });
               
               
          }
          setTimeout(function(){
            if(index==($scope.userSettings.length-1) && push==true)
            {
            
                    $scope.userSettings.push(id);
                     $("#category"+id).addClass('checked');
                $("#category"+id).removeClass('unchecked');
                var ref = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/interested_categories");
               var new_data=JSON.parse(angular.toJson(cat));
              ref.push(new_data);
            }
            },10);
        });
      }
}
$scope.data=[];
$scope.createTicket=function()
{
  
  if($scope.data.feedback)
  {

  
    var ref = firebase.database().ref("/feedbackTicketsQuestionPrivate");
 
    var params={};
    params.publishAt=new Date();
    
    params.issue='';
    params.status='open';
    params.feedback=$scope.data.feedback;
    params.userid=JSON.parse(window.localStorage.getItem('info')).uid;
     var new_data=JSON.parse(angular.toJson(params));
    ref.push(new_data);
    $ionicPopup.alert({
        title: 'Worklidate',
        content: 'Thank you for getting in touch!.\n Have a great day ahead!.'
        }).then(function(res) {
         $scope.data=[];
        });
        $scope.modal.hide();
  }
}
 Analytics.trackPage('Settings');
}
];