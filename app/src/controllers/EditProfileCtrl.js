'use strict';
module.exports = [
    '$scope','Upload','$rootScope','$state','$ionicPopup','$firebaseObject','$window','Analytics', function($scope,Upload,$rootScope,$state,$ionicPopup,$firebaseObject,$window,Analytics) {
$rootScope.mapdetails=null;
$rootScope.checkLogin();
$scope.data=$rootScope.userdata;
var storageRef = firebase.storage().ref();
$scope.uploadBtnText='';
// upload on file select or drop
    $scope.onFileSelect = function (file) {
      
    if(file[0])
    {
      
    if(file[0].size<=2228571)
   {
    var mountainsRef = storageRef.child('upload/profile/'+JSON.parse(window.localStorage.getItem('info')).uid).put(file[0]);
    mountainsRef.on('state_changed', function(snapshot){
     var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progress=parseInt(progress);
      
      $scope.uploadBtnText='Upload is ' + progress + '% done';
      if(!$scope.$$phase) {
                    $scope.$apply();
                    }
                    
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function(error) {
      // Handle unsuccessful uploads
    }, function() {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      var downloadURL = mountainsRef.snapshot.downloadURL;
      var ref = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/").update({picture:downloadURL});
      $rootScope.userdata.picture=downloadURL;
      $scope.uploadBtnText='';
       if(!$scope.$$phase) {
                    $scope.$apply();
                    }
    });
      
      }
      else
      {
        alert("File size must be less than 2MB.");
      }
    }
    };
     $scope.onAboutFileSelect = function(file,type) {
      if(file[0] && type=='image')
      {
       

        file[0].objecttype="image";
        if($scope.aboutPhoto)
        {
          $scope.aboutPhoto.push(file[0]);
        }
        else
        {
          $scope.aboutPhoto=[];
          $scope.aboutPhoto.push(file[0]);
        }
       }
       if(type=="text")
       {
        var data=[];
        data.text="";
         data.objecttype="text";
          if($scope.aboutPhoto)
          {
            $scope.aboutPhoto.push(data);
          }
          else
          {
            $scope.aboutPhoto=[];
            $scope.aboutPhoto.push(data);
          }

       }

      
    };
    $scope.deleteAbout=function(id)
    {
      
      if($scope.data)
        if($scope.data.aboutPhoto)
        if($scope.data.aboutPhoto[id])
          delete $scope.data.aboutPhoto[id];

       /*var ref_delete = firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/aboutPhoto/'+id);
           ref_delete.remove();
           setTimeout(function(){
      }
      var ref_get_about_photo = firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/aboutPhoto');
      ref_get_about_photo.once("value", function(aboutP) {
      console.log(aboutP.val());

        $scope.oldAbout=aboutP.val();
        
      });
    },100);*/
    }
    $scope.delete=function(index)
    {
   
      $scope.filesdata_temp=[];
      $scope.aboutPhoto.forEach(function(entry,ei){
      if(ei!=index)
        $scope.filesdata_temp.push(entry);
      });
      setTimeout(function(){
        delete $scope.aboutPhoto;
       $scope.aboutPhoto=[];
       $scope.aboutPhoto=$scope.filesdata_temp;
        if(!$scope.$$phase) {
                    $scope.$apply();
                    }
      },100);
       
    
    }
  $scope.fillText=function(text,index)
  {
     $scope.aboutPhoto[index].text=text;
  
  }
    $scope.searchSkills=function(data)
    {
    
    }
  $scope.save=function(data)
  {

    if(data)
    { 
      
      if(!data.profession || data.profession.length==0)
      {

        $ionicPopup.alert({
        title: 'Required!',
        content: 'Please pick atleast one profession.'
        }).then(function(res) {
        console.log('Test Alert Box');
        });
      }
      else
      {  
         if(!data.skills || data.skills.length==0)
      {
        $ionicPopup.alert({
        title: 'Required!',
        content: 'Please pick atleast one skill.'
        }).then(function(res) {
        console.log('Test Alert Box');
        });
      }
      else
      {
        if(!data.location)
        {
          $ionicPopup.alert({
          title: 'Required!',
          content: 'Please add your location.'
          }).then(function(res) {
          console.log('Test Alert Box');
          });
        }
        else
        {
          if(!data.title)
          {
            $ionicPopup.alert({
            title: 'Required!',
            content: 'Please add your title.'
            }).then(function(res) {
            console.log('Test Alert Box');
            });
          }
          else
          {  
            $state.go('app.profile');  
            if($scope.locationVarify)
              data.locationVerified=true;
              var offset = new Date().getTimezoneOffset();
                data.timeoffset=offset;
            var new_data=JSON.parse(angular.toJson(data));
            delete new_data.picture;
          console.log(new_data);
            var ref = firebase.database().ref();
            firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/").update(new_data);
            if($scope.aboutPhoto)
            {
              var images=[];
              $scope.lastImageAboutPhoto=-1;
              $scope.aboutPhoto.forEach(function(entry,index){
                if(entry.objecttype!="text")
                {
                  $scope.lastImageAboutPhoto=parseInt($scope.lastImageAboutPhoto)+1;
                }
              });
               $scope.aboutPhoto.forEach(function(entry,index){
                if(entry.objecttype!="text")
                {

                 var mountainsRef = storageRef.child('upload/profile/about/'+JSON.parse(window.localStorage.getItem('info')).uid+'/'+entry.name).put(entry);
                    mountainsRef.on('state_changed', function(snapshot){
                       progress=parseInt(progress);
                     var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    
                      switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                          console.log('Upload is paused');
                          break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                          console.log('Upload is running');
                          break;
                      }
                    }, function(error) {
                      // Handle unsuccessful uploads
                    }, function() {
                      // Handle successful uploads on complete
                      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                      var downloadURL = mountainsRef.snapshot.downloadURL;
                      $scope.aboutPhoto[index].downloadUrl=downloadURL;
                     
                      if(index==$scope.lastImageAboutPhoto)
                      {

                        var ref = firebase.database().ref();
                               var images=[];
                              
                               for(var key in $scope.oldAbout){
                                images.push({type:$scope.oldAbout[key].type,data:$scope.oldAbout[key].data})
                             }
                                $scope.aboutPhoto.forEach(function(entry1,index1){
                                if(entry1.objecttype=="text")
                                  images.push({type:entry1.objecttype,data:entry1.text});
                                else
                                  images.push({type:entry1.objecttype,data:entry1.downloadUrl});

                                  if($scope.aboutPhoto.length==index1+1)
                                  {
                                   
                                     ref.child("users").child(JSON.parse(window.localStorage.getItem('info')).uid).update({
                                      aboutPhoto:images
                                    });
                                  }

                             });
                      }
                    }); 
                 }              
                                
              });

                         
            }
            var myRootRef_search = firebase.database().ref('/search/users');
            var category=[];

              if(data.profession)
              data.profession.forEach(function(entry){
                category.push(entry.name);
              });
              var categoryid=[];
              if(data.categories)
                data.categories.forEach(function(entry){
                  categoryid.push(entry.id);
                });

               var tags=[];
                if(data.tags)
                data.tags.forEach(function(entry){
                  tags.push(entry.text);
                });
            myRootRef_search.orderByChild("userid").equalTo(JSON.parse(window.localStorage.getItem('info')).uid).once("value", function(snapshot) {
            for(var key in snapshot.val())
            {
            if(key)
            {
               
              myRootRef_search.child(key).update({title:(data.name).toLowerCase(),category:category.join(','),location:data.location,subtitle:data.title,tags:tags,categoryid:categoryid.join(',')});
              }
            }
             
            });
        
          }
        }
      }
      }  
    }
  }


$scope.validateLocation=function()
{
$scope.locationVarify=false;
/* if (navigator.geolocation) 
    navigator.geolocation.getCurrentPosition(function(position){
     $scope.position=position.coords;
   



 if($scope.position)
 {
        setTimeout(function(){
            var lat=$rootScope.mapdetails.geometry.location.lat();
            var lng=$rootScope.mapdetails.geometry.location.lng();
            var lat1=$scope.position.latitude;
            var lng1=$scope.position.longitude;
             
            var diffLat=parseInt(lat)-parseInt(lat1);
            var diffLng=parseInt(lng)-parseInt(lng1);
          
            if(diffLat<=1 && diffLng<=1)
              $scope.locationVarify=true;
            else
            $scope.locationVarify=false;

            $scope.$apply();
            console.log($scope.locationVarify);
          },1000);
    }
    });*/
}

$scope.removePorfilePic=function()
{
    var confirm=$window.confirm("Really want to delete it?");
  if(confirm){
  
            var ref = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/picture/");
            ref.remove();
            $rootScope.userdata.picture="";
  }
}


  $scope.dragControlListeners = {
    accept: function (sourceItemHandleScope, destSortableScope) {return boolean},
    itemMoved: function (event) {},
    orderChanged: function(event) {},
    containment: '#board',
    clone: true ,
    allowDuplicates: false 
};

$scope.motherCatSelect=function(category)
{
   $scope.CategoryID = category.id;
}
 Analytics.trackPage('Edit_Profile');
}
];