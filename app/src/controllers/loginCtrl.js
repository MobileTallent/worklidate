'use strict';
module.exports = [
    '$scope','Firebase','$state','$ionicLoading','$timeout','$rootScope','$ionicPopup','$http','$window','Analytics','$ionicModal',function($scope,Firebase,$state,$ionicLoading,$timeout,$rootScope,$ionicPopup,$http,$window,Analytics,$ionicModal) {
 $ionicLoading.hide();
$rootScope.checkLogin();
if(window.localStorage.getItem('just_logout'))
{
  window.localStorage.removeItem('just_logout');
  location.reload();
}
 $scope.data=[];
  $ionicModal.fromTemplateUrl('interested_category_1.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
 var auth = firebase.auth();
 var root_ref = firebase.database().ref();
 $scope.userSettings=[];

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
        
});

$scope.userlogin=function(data)
{

 
   if (!data.username || !data.password) 
  {
    alert("Enter Username/Password");
  }
  else{
     $ionicLoading.show({
      template: 'Loading...'
    });


auth.signInWithEmailAndPassword(data.username, data.password).then(function(authData) {

  
  if (authData.emailVerified) {
    var userref_ = firebase.database().ref('/users/'+authData.uid+'/accountStatus').set('activated');
   
     window.localStorage.setItem('info',JSON.stringify(authData));  
            $scope.data.password='';
            $ionicLoading.hide();
             var Backlen=history.length;   
             history.go(-Backlen); 
             $rootScope.refreshHomePage=true;
              if(window.localStorage.getItem('info')) {
                $rootScope.loggedUserId=JSON.parse(window.localStorage.getItem('info')).uid;
            }

             window.location.replace("#/app/mainpage");
             $rootScope.getInitialUserData();

  }
  else {
   
     $scope.data.password='';
           $ionicLoading.hide();
            var myPopup = $ionicPopup.show({
                template: '<b>Your email address is not confirm yet. Please confirm your email address.</b>',
                title: 'Worklidate',
                subTitle: '',
                scope: $scope,
                buttons: [
                  { text: 'OK' },
                  {
                    text: 'Resend Email',
                    type: 'button-positive',
                    onTap: function(e) {
                     authData.sendEmailVerification(); 
                      myPopup.close();
                    }
                  }
                ]
              });
  }




      
}, function(error) {

  console.log(error);
   $ionicLoading.hide();
  var email = error.email;
  // The provider's credential:
  


 if(error.code=="auth/user-not-found")
 {
  var alertPopup = $ionicPopup.alert({
           title: 'Login Failed',
           template:'There is no user record corresponding to this email address.'
         });
 }
 else
 {
   var alertPopup = $ionicPopup.alert({
           title: 'Login Failed',
           template:error.message
         });
 }
  var credential = error.credential;
  // In case of auth/account-exists-with-different-credential error,
  // you can fetch the providers using this:
  if (error.code === 'auth/account-exists-with-different-credential') {
    auth.fetchProvidersForEmail(email).then(function(providers) {
      // The returned 'providers' is a list of the available providers
      // linked to the email address. Please refer to the guide for a more
      // complete explanation on how to recover from this error.
    });
  }
});
  
  
 
}
}

$scope.saveData=function(authData,type)
{
  var d=new Date();
  var offset = new Date().getTimezoneOffset();

  var fname='',lname='';
  var fullNameSplit=authData.user.displayName.split(' ');
  if(fullNameSplit[0])
    fname=fullNameSplit[0];
   if(fullNameSplit[1])
    lname=fullNameSplit[1];

 
  var ref = firebase.database().ref("/users/"+authData.user.uid);
        ref.on("value", function(snapshot) {
          if(snapshot.val())
          {
             root_ref.child("users").child(authData.user.uid).update({
              provider: type,
              name: getName(authData,type),
              email:authData.user.email,
              firstname:fname,
              lastname:lname,
              
            });
             if(snapshot.val().interested_categories)
             {
               window.localStorage.setItem('info',JSON.stringify(authData.user));  
              
               $ionicLoading.hide();
               var Backlen=history.length;   
               history.go(-Backlen); 
               $rootScope.refreshHomePage=true;
               window.location.replace("#/app/mainpage");
             }
             else
             {
              window.localStorage.setItem('info',JSON.stringify(authData.user));
             $rootScope.getInitialUserData();
              $ionicLoading.hide();
              $scope.modal.show();
              $scope.uid=authData.user.uid;
             }
          }
          else
          {
             root_ref.child("users").child(authData.user.uid).set({
              provider: type,
              name: getName(authData,type),
              email:authData.user.email,
              firstname:fname,
              lastname:lname,
              locationVerified:false,
              timeoffset:offset,
              accountStatus:"activated"
            });
              $scope.modal.show();
              window.localStorage.setItem('info',JSON.stringify(authData.user));
              $rootScope.getInitialUserData();
              $scope.uid=authData.user.uid;
          }
            
          });
          
}
function getName(authData,type) {
  switch(type) {
     case 'password':
       return authData.password.email.replace(/@.*/, '');
     case 'twitter':
       return authData.user.displayName;
     case 'facebook':
       return authData.user.displayName;
       case 'google':
       return authData.user.displayName;
  }
}

 $scope.login = function(type) {
  
  var provider;
if(type=='facebook')
   provider = new firebase.auth.FacebookAuthProvider();
if(type=='email')
   provider = new firebase.auth.EmailAuthProvider();
if(type=='google')
provider = new firebase.auth.GoogleAuthProvider();
  
if(type=='twitter')
   provider = new firebase.auth.TwitterAuthProvider();

provider.addScope('email');
provider.addScope('profile');

auth.signInWithPopup(provider).then(function(authData) {
  // User signed in!
  var uid = authData.user.uid;
    $scope.saveData(authData,type);
                  if(window.localStorage.getItem('info')) {
                $rootScope.loggedUserId=uid;
            }
  }).catch(function(error) {
     console.log(error);
  });

    
};

/*Auth.$onAuth(function(authData) {
  if (authData === null) {
    console.log("Not logged in yet");
  } else {
    console.log("Logged in as", authData.uid);
  }
  $scope.authData = authData; // This will display the user's name in our view
  console.log(authData);
});*/

$scope.getCategories=function(id)
{

  $("#category"+id).toggle('show');
  
}
$scope.userdata=[];
$scope.interested_categoriesDone=function(data)
{
   var new_data=JSON.parse(angular.toJson($scope.userdata.interested_categories));
var myRootRef_a = firebase.database().ref('/users/'+$scope.uid+"/interested_categories").set(new_data, function(error) {
  if (error) {
    alert("Data could not be saved." + error);
    $scope.modal.hide();
  } else {
$scope.modal.hide();
   var Backlen=history.length;   
               history.go(-Backlen); 
               $rootScope.refreshHomePage=true;
               window.location.replace("#/app/mainpage");
  }
});


}
$scope.markCategory=function(id,cat)
{



  if($scope.userSettings.length==0)
      {
     
          $scope.userSettings.push(id);
          $("#category"+id).addClass('checked');
          $("#category"+id).removeClass('unchecked');
          $scope.userdata.interested_categories=[];
          $scope.userdata.interested_categories.push(cat);
         
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
                
                 $scope.userdata.interested_categories.splice(index,1);
               
               
          }
          setTimeout(function(){
            if(index==($scope.userSettings.length-1) && push==true)
            {
            
                    $scope.userSettings.push(id);
                     $("#category"+id).addClass('checked');
                $("#category"+id).removeClass('unchecked');
               $scope.userdata.interested_categories.push(cat);
               } if(!$scope.$$phase) {
                    $scope.$apply();
                    }
            },10);
        });
      }

}
$scope.logout=function()
{
  Auth.$unauth();

}
Analytics.trackPage('Login');
//
}
];