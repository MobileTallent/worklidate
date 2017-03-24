'use strict';
module.exports = [
  '$scope','$stateParams','$rootScope','Firebase','Upload','$ionicLoading','Analytics', function($scope,$stateParams,$rootScope,Firebase,Upload,$ionicLoading,Analytics) {
 $scope.projectid=$stateParams.id;
 $rootScope.checkLogin();
 $scope.onFileSelect = function (file) {
  if(file[0])
  {
  	if($scope.editfilesdata)
    {
    	$scope.editfilesdata.push(file[0]);
    }
    else
    {
    	$scope.editfilesdata=[];
    	$scope.editfilesdata.push(file[0]);
    }
   }
   
      
    };

 $scope.save=function(data)
 {
 $ionicLoading.show({
			     		 template: 'Updating...'
			    		});
 data.updatedAt=new Date();

 var dataArray={categories:data.categories,tags:data.tags,description:data.description,projectTitle:data.projectTitle,updatedAt:data.updatedAt};
 var new_data=JSON.parse(angular.toJson(dataArray));
 var project_ref = firebase.database().ref('/projects/'+$scope.projectid);

 project_ref.update(new_data);
 


		   if($scope.editfilesdata)
		   			{
		   			$ionicLoading.show({
			     		 template: 'Uploading Images...'
			    		});
					  Upload.upload({
					            url: $rootScope.serverURL+'/uploadfile.php?type=addproject',
					           data: {file:$scope.editfilesdata,id:JSON.parse(window.localStorage.getItem('info')).uid,project_id:$scope.projectid},
					        }).then(function (resp) {
					            
					            var images=[];
					            if(data.images)
					              images=data.images;
					            $scope.editfilesdata.forEach(function(entry,index){
							    	images.push($rootScope.serverURL+'/upload/project/'+JSON.parse(window.localStorage.getItem('info')).uid+'/'+$scope.projectid+'/'+entry.name);
							    	if(index==$scope.editfilesdata.length-1)
							    	{
							    		var image_refs = firebase.database().ref('/projects/'+$scope.projectid+'/images');
   			   			 				var image_refs_Ref = image_refs.set(images);
   			   			 				$scope.editfilesdata=[];
                        
										}

							    });
							    
					              $ionicLoading.hide();
						         
					        }, function (resp) {
					           
					            	 $ionicLoading.hide();
					        }, function (evt) {
					            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					           
					            $ionicLoading.show({
					     		 template: progressPercentage+'%'
					    		});
					        });
		   			   			
		   							}
                    
 }
 


 $scope.removePhoto=function(id)
 {

 if(id>=0){
  	var ref1 = firebase.database().ref("/projects/"+$scope.projectid+"/images/"+id);
 	ref1.remove();
  }
 }
  Analytics.trackPage('Edit_Project');
}
];