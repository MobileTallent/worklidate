'use strict';
module.exports = [
    '$scope','Upload','$rootScope','Firebase','$ionicLoading','$location','$ionicPopup','Analytics','$ionicModal',function($scope,Upload,$rootScope,Firebase,$ionicLoading,$location,$ionicPopup,Analytics,$ionicModal) {
$scope.data={};
var storageRef = firebase.storage().ref();
 $scope.onDropComplete = function (index, obj, otherIndex) 
{
   
                    var dataOld=$rootScope.filesdata[otherIndex];
                    $rootScope.filesdata.splice(index, 1);
                    $rootScope.filesdata.splice(otherIndex, 0, obj);
                    
}
$scope.coverP=false;

$scope.setCoverPic=function(index)
{
  $rootScope.filesdata.forEach(function(entry,i){
    if(i==index)
    $rootScope.filesdata[i].coverPic=true;
    else
    $rootScope.filesdata[i].coverPic=false;
  });
}
  $scope.onFileSelect = function (file,type) {
  if(file[0] && type=='image')
  {
    if($scope.coverP==false)
    file[0].coverPic=true;
    $scope.coverP=true;

    file[0].objecttype="image";
    if($rootScope.filesdata)
    {
      $rootScope.filesdata.push(file[0]);
    }
    else
    {
      $rootScope.filesdata=[];
      $rootScope.filesdata.push(file[0]);
    }
   }
   if(type=="text")
   {
    var data=[];
    data.text="";
     if($scope.coverP==false)
      data.coverPic=true;
      $scope.coverP=true;

     data.objecttype="text";
      if($rootScope.filesdata)
      {
        $rootScope.filesdata.push(data);
      }
      else
      {
        $rootScope.filesdata=[];
        $rootScope.filesdata.push(data);
      }

   }

      
    };
    $scope.coverPicDeleted=false;
    $scope.delete=function(index)
    {
     
      $scope.filesdata_temp=[];
      $rootScope.filesdata.forEach(function(entry,ei){
      if(ei!=index)
        $scope.filesdata_temp.push(entry);
     
     if(ei==index)
      if(entry.coverPic==true)
        $scope.coverPicDeleted=true;
        
    });
      setTimeout(function(){
        delete $rootScope.filesdata;
       $rootScope.filesdata=[];
       $rootScope.filesdata=$scope.filesdata_temp;
       if($scope.coverPicDeleted==true)
        if($scope.filesdata[0])
          $scope.filesdata[0].coverPic=true;
        else
          $scope.coverP=false;

        $scope.coverPicDeleted=false;
       
       $rootScope.$apply();
      },100);
       
    
    }
  $scope.fillText=function(text,index)
  {
     $rootScope.filesdata[index].text=text;
     
  }
    

    $scope.publishProject=function(data)
    {
      $scope.closeModal();
   
        $scope.filesdata_temp1=[];
        if($rootScope.filesdata)
        {
      $rootScope.filesdata.forEach(function(entry,ei){
        entry.ei=ei;
      if(entry.objecttype=='image')
        $scope.filesdata_temp1.push(entry);

      if(entry.coverPic==true)
        $scope.coverPicture=entry;
       
      });
    }


   if(data)
        {
        if(!data.projectTitle)
      {
        $ionicPopup.alert({
        title: 'Required!',
        content: 'Please enter project title.'
        }).then(function(res) {
        console.log('Test Alert Box');
        });
      }
      else
      {
        $ionicLoading.show({
            template: 'Adding Project...'
          });
          data.images=[];
          data.publishAt=new Date();
          data.views=0;
          data.likes=0;
         

                var category=[];
                var categoryid=[];

                if(data.categories)
                data.categories.forEach(function(entry){
                  category.push(entry.name);
                   categoryid.push(entry.id);
                });
               
                var tags=[];
                if(data.tags)
                data.tags.forEach(function(entry){
                  tags.push(entry.text);
                });
                var new_data=JSON.parse(angular.toJson(data));
                new_data.userid=JSON.parse(window.localStorage.getItem('info')).uid;
                

                var myRootRef = firebase.database().ref('/projects');
                 var collectionRef = myRootRef.push(new_data);

                  categoryid.forEach(function(entry){
                   
                     var myRootRef_a = firebase.database().ref('/categoryprojects/'+entry);
                     myRootRef_a.push(JSON.parse(angular.toJson({project_id:collectionRef.key,timestamp:data.publishAt})));
                  });

                 
                
              
                if($scope.coverPicture)
                {
               if($scope.coverPicture.objecttype=='text')
                  var coverPicture_refs = firebase.database().ref('/projects/'+collectionRef.key+'/coverPicture').set({type:$scope.coverPicture.objecttype,data:$scope.coverPicture.text});
              }

                var myRootRef_search = firebase.database().ref('/search/projects');
                var collectionRef_search = myRootRef_search.push({project_id:collectionRef.key,title:(data.projectTitle).toLowerCase(),category:category.join(),tags:tags,publishAt:new_data.publishAt});


                var myRootRef_timeline = firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/timeline');
                var collectionRef_timeline = myRootRef_timeline.push({publishAt:new_data.publishAt,title:'Project Posted',subTitle:data.projectTitle,description:data.description,type:"projects",reference:collectionRef.key,statusline:""});
            if($rootScope.filesdata)
            {
              if($scope.filesdata_temp1.length>0)
              {
                $rootScope.downloadUrlData=[];
            $ionicLoading.show({
               template: 'Uploading Images...'
              });
              
              $scope.filesdata_temp1.forEach(function(entry1,index1){
                
                 var mountainsRef = storageRef.child('upload/project/'+JSON.parse(window.localStorage.getItem('info')).uid+'/'+collectionRef.key+'/'+entry1.name).put(entry1);
                    mountainsRef.on('state_changed', function(snapshot){
                     var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                     progress=parseInt(progress);
                       $ionicLoading.show({
                   template: 'Upload is ' + parseInt(progress) + '% done'
                  });
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
                      $rootScope.filesdata[entry1.ei].downloadUrl=downloadURL;
                      $scope.downloadUrlData.push(downloadURL);
                     
                      if(index1==$scope.filesdata_temp1.length-1)
                      {

                        var images=[];
                      $rootScope.filesdata.forEach(function(entry,index){
                        
                      if(entry.objecttype=="text" && entry.text)
                        images.push({type:entry.objecttype,data:entry.text});
                      else if(entry.objecttype=="image" && $scope.downloadUrlData[index])
                        images.push({type:entry.objecttype,data:$scope.downloadUrlData[index]});

                      setTimeout(function(){
                      if(entry.coverPic==true)
                      {
                        if(entry.objecttype=='text')
                        {
                          
                          var coverPicture_refs = firebase.database().ref('/projects/'+collectionRef.key+'/coverPicture').set({type:entry.objecttype,data:entry.text});
                        }
                        else
                        {
                          
                         
                            var coverPicture_refs = firebase.database().ref('/projects/'+collectionRef.key+'/coverPicture').set({type:entry.objecttype,data:$scope.downloadUrlData[index]});
                        }

                      }
                   

                    if(index==$rootScope.filesdata.length-1)
                    {
                       setTimeout(function(){
                      
                      var image_refs = firebase.database().ref('/projects/'+collectionRef.key+'/images');
                        var image_refs_Ref = image_refs.set(images);
                        

                      $ionicLoading.show({
                          template: 'Project published...'
                        });

                        $location.path('/app/project_details/'+collectionRef.key);
                        
                        setTimeout(function(){
                          $ionicLoading.hide();
                          $rootScope.filesdata=[];
                          $scope.data={};
                          location.reload();
                      },100);
                         },100);
                    }
                  },1000);
                  });
                  
                        $ionicLoading.hide();
                      }

                    }); 
                               
                                
              });

            }
            else
            {
                    var images=[];
                      $rootScope.filesdata.forEach(function(entry,index){
                      if(entry.objecttype=="text")
                        images.push({type:entry.objecttype,data:entry.text});
                      

                      if(entry.coverPic==true)
                        var coverPicture_refs = firebase.database().ref('/projects/'+collectionRef.key+'/coverPicture').set({type:'text',data:entry.text});

                 

                    if(index==$rootScope.filesdata.length-1)
                    {
                      var image_refs = firebase.database().ref('/projects/'+collectionRef.key+'/images');
                        var image_refs_Ref = image_refs.set(images);
                        

                      $ionicLoading.show({
                          template: 'Project published...'
                        });

                        $location.path('/app/project_details/'+collectionRef.key);
                        
                        setTimeout(function(){
                       $ionicLoading.hide();
                       $rootScope.filesdata=[];
                        $scope.data={};
                        location.reload();
                      },100);
                    }

                  });
            }
                    
                    }
                    else
                    {

                      $ionicLoading.show({
                          template: 'Project published...'
                        });
                      $location.path('/app/project_details/'+collectionRef.key);
                       
                      setTimeout(function(){
                        location.reload();
                       $ionicLoading.hide();
                      },100);
                    }
                    }
                
            }

       }
       $ionicModal.fromTemplateUrl('my-modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });
        $scope.openModal = function() {
          $scope.modal.show();
        };
        $scope.closeModal = function() {
          $scope.modal.hide();
        };
        
       Analytics.trackPage('Add_Project');
}
];