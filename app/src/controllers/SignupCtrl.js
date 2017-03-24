'use strict';
module.exports = [
   '$scope','Firebase','$state','$rootScope','$ionicLoading','$ionicModal','$http','$ionicPopup','Analytics', function($scope,Firebase,$state,$rootScope,$ionicLoading,$ionicModal,$http,$ionicPopup,Analytics) {
$rootScope.checkLogin();
$rootScope.mapdetails=null;
$scope.locationVarify=false;
$scope.userdata=[];
 $ionicModal.fromTemplateUrl('interested_category.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
$scope.validateLocation=function(loadtype)
{
 if (navigator.geolocation) 
    navigator.geolocation.getCurrentPosition(function(position){
     $scope.position=position.coords;
  $scope.locationVarify=false;
 if($scope.position)
 {
        setTimeout(function(){
           
            var lat1=$scope.position.latitude;
            var lng1=$scope.position.longitude;
            if(loadtype=='html' && $rootScope.mapdetails){
              var lat=$rootScope.mapdetails.geometry.location.lat();
              var lng=$rootScope.mapdetails.geometry.location.lng();
              var diffLat=parseInt(lat)-parseInt(lat1);
              var diffLng=parseInt(lng)-parseInt(lng1);
        
              if(diffLat<=1 && diffLng<=1)
                $scope.locationVarify=true;
              else
              $scope.locationVarify=false;

              if(!$scope.$$phase) {
                    $scope.$apply();
                    }
            }
            if(loadtype=='onload')
            {
            var geocoder;
            geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(lat1, lng1);

            geocoder.geocode(
                {'latLng': latlng}, 
                function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                           var add= results[0].formatted_address ;
                            var  value=add.split(",");

                            count=value.length;
                            country=value[count-1].replace(/[0-9]/g, '');
                            state=value[count-2].replace(/[0-9]/g, '');
                            city=value[count-3].replace(/[0-9]/g, '');
                           
                           
                              $scope.userdata.location=city+', '+state+', '+country;
                              $scope.locationVarify=true;
                            }
                            
                    }
                }
            );
            }
          },1000);
    }
    });
}
//$scope.validateLocation('onload');
$scope.next=function()
{
  $ionicLoading.show({
      template: 'Loading...'
    });
  var myRootRef_get_invitation = firebase.database().ref('/invitationcodes/');

 myRootRef_get_invitation.orderByChild('code').equalTo($scope.userdata.invitationcode).on("value", function(code) {
  if(code.val() && code.val()!=null)
  {
     
     for(var key in code.val())
     {

       
      if( (code.val()[key].status=='used' || code.val()[key].status=='open') && code.val()[key].code==$scope.userdata.invitationcode)
      {
         $scope.invitationcodeKey=key;
          $scope.modal.show();
           $ionicLoading.hide();
      }
     }
   
  }//end if(code.val()!=null && code.val().status=='open' code.val().code==userdata.invitationcode)
    else
    {
       $ionicLoading.hide();
      $ionicPopup.alert({
        title: 'Invitation Code',
        content: 'Invalid Invitation Code.'
        });
    }

});
}

$scope.signup=function(userdata)
{
$scope.modal.hide();
    $ionicLoading.show({
      template: 'Loading...'
    });
   var d=new Date();
  var offset = new Date().getTimezoneOffset();
    

  var ref = firebase.database().ref();
  firebase.auth().createUserWithEmailAndPassword(userdata.email, userdata.password).then(function(user) {

var  value=userdata.location.split(",");
       
    var new_data=JSON.parse(angular.toJson({
            provider: 'email&pass',
            name: userdata.firstname+' '+userdata.lastname,
            timezone: userdata.timezone,
            email    : userdata.email,
            location:userdata.location,
            firstname:userdata.firstname,
            lastname:userdata.lastname,
            interested_categories:userdata.interested_categories,
            locationVerified:$scope.locationVarify,
            signUpDate:d,
            timeoffset:offset,
            accountStatus:"pending",
            invitationcode:userdata.invitationcode
          }));
          if(value[2])
          new_data.country=value[2].split(' ').join('').replace(/[0-9]/g, '');
          if(value[1])
          new_data.state=value[1].split(' ').join('').replace(/[0-9]/g, '');
          if(value[0])
          new_data.city=value[0].split(' ').join('').replace(/[0-9]/g, '');

           

          ref.child("users").child(user.uid).set(new_data);
          var myRootRef_search = firebase.database().ref('/search/users');
           var category=[];

              if(userdata.interested_categories)
              userdata.interested_categories.forEach(function(entry){
                category.push(entry.name);
              });
              var categoryid=[];
              if(userdata.categories)
                userdata.categories.forEach(function(entry){
                  categoryid.push(entry.id);
                });
           
          firebase.database().ref('/invitationcodes/'+$scope.invitationcodeKey+'/status').set('registered');
          firebase.database().ref('/invitationcodes/'+$scope.invitationcodeKey+'/userid').set(user.uid);
         
          var collectionRef_search = myRootRef_search.push({userid:user.uid,title:(userdata.firstname+' '+userdata.lastname).toLowerCase(),category:category.join(),location:userdata.location,categoryid:categoryid.join(),signUpDate:new_data.signUpDate});

          user.sendEmailVerification(); 
          $ionicLoading.hide();
                  var myPopup = $ionicPopup.show({
                template: '<b>Account created successfully. Please confirm your email address.</b>',
                title: 'Worklidate',
                subTitle: '',
                scope: $scope,
                buttons: [
                  { 
                    text: 'OK', 
                    onTap: function(e) {
                      myPopup.close();
                      $state.go('app.login');
                      location.reload();
                    }
                  },
                  {
                    text: 'Resend Email',
                    type: 'button-positive',
                    onTap: function(e) {
                   
                     user.sendEmailVerification(); 
                     
                     myPopup.close();
                    $state.go('app.login');
                    location.reload();
                    }
                  }
                ]
              });

        

}, function(error) {
  
    var errorCode = error.code;
  var errorMessage = error.message;
  $ionicLoading.hide();
   alert(error.message);

});


  
}




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

$scope.getCategories=function(id)
{

  $("#category"+id).toggle('show');
  
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
               }
                  if(!$scope.$$phase) {
                    $scope.$apply();
                    }
            },10);
        });
      }

}

Analytics.trackPage('SignUp');
}
];