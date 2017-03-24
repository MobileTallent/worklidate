'use strict';
module.exports = [
   '$scope','$filter','Upload','$rootScope','Firebase','$ionicLoading','$location','$ionicPopup','$ionicModal','Analytics', function($scope,$filter,Upload,$rootScope,Firebase,$ionicLoading,$location,$ionicPopup,$ionicModal,Analytics) {
$scope.job=[];
$rootScope.checkLogin();
var storageRef = firebase.storage().ref();
$scope.job.description="";
$scope.onFileSelect = function (file,type) {

  if(file[0])
  {
  	
   if(file[0].size<=39000000)
   {
  	if($scope.attachedfilesdata)
    {
    	$scope.attachedfilesdata.push(file[0]);
    }
    else
    {
    	$scope.attachedfilesdata=[];
    	$scope.attachedfilesdata.push(file[0]);
    }
    }
	else{
		alert("File size must be less than 35MB.");
	}

   }
   else
   {
   
    
   }
   
      
    };
$scope.delete=function(index)
    {
     
      $scope.filesdata_temp=[];
    	$scope.attachedfilesdata.forEach(function(entry,ei){
      if(ei!=index)
        $scope.filesdata_temp.push(entry);
      });
      setTimeout(function(){
        delete $scope.attachedfilesdata;
       $scope.attachedfilesdata=[];
       $scope.$apply();
      },100);
       
    
    }
    $scope.removeQuestion=function(index)
    {
    	$scope.job.screeningQuestions.splice(index,1);
    }
    $scope.invalidFile=function(s)
    {
    	
    }
    $ionicModal.fromTemplateUrl('my-modal.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });
    $scope.confirm_postJob=function()
    {
		$scope.openModal()
    }
    $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
 $scope.postJob=function(jobdetails)
 {


 	$scope.closeModal();
	if($scope.job.title)
	{
		if($scope.job.budget)
		{
			if($scope.job.deliveryTime)
			{
				
				var s_date=$scope.job.deliveryTime.split('-');
				var c_date=new Date();
				var d_date=new Date(s_date[1]+'/'+s_date[0]+'/'+s_date[2]);
				var startDate=$filter('date')(c_date, "dd/MM/yyyy");
				var endDate=$filter('date')(d_date, "dd/MM/yyyy");
        		//if(startDate<=endDate)
        		//{
        			if($scope.job.categories)
				{
					$scope.publishJob(jobdetails);
				}
				else
				{
					$ionicPopup.alert({
						title: 'Required',
						template:"Please enter the job categories."
					});
				}
       			// }
				//else
			//{
				//$ionicPopup.alert({
				//	title: 'Invalid Date',
				//	template:"Please enter the correct job delivery time."
				//});
			//}
			}
			else
			{
				$ionicPopup.alert({
					title: 'Required',
					template:"Please enter the job delivery time."
				});
			}
		}
		else
		{
			$ionicPopup.alert({
				title: 'Required',
				template:"Please enter the job budget."
			});
		}
	}
	else
	{
		$ionicPopup.alert({
			title: 'Required',
			template:"Please enter the job title."
		});
	}
 }
 $scope.publishJob=function(jobdetails)
 {
 	$ionicLoading.show({
		      template: 'Uploading job...'
		    });
		    var u_data=[];
			$scope.job.publishAt=new Date();
			u_data.publishAt=$scope.job.publishAt.toString();
			u_data.title=$scope.job.title;
		 	u_data.userid=JSON.parse(window.localStorage.getItem('info')).uid;
		 	if($scope.job.categories)
			u_data.categories=JSON.parse(angular.toJson($scope.job.categories));
			if($scope.job.aboutBrand)
			u_data.aboutBrand=$scope.job.aboutBrand;
			if($scope.job.targetAudience)
			u_data.targetAudience=$scope.job.targetAudience;
			if($scope.job.designValue)
			u_data.designValue=$scope.job.designValue;
			if($scope.job.colorsParticular)
			u_data.colorsParticular=$scope.job.colorsParticular;
			if($scope.job.deliveryTime)
			u_data.deliveryTime=$scope.job.deliveryTime;
			if($scope.job.description)
			u_data.description=$scope.job.description;
			if($scope.job.budget)
			u_data.budget=$scope.job.budget;
			if($scope.job.talentnumber)
			u_data.talentnumber=$scope.job.talentnumber;
			if($scope.job.jobLength)
			u_data.jobLength=$scope.job.jobLength;
			if($scope.job.experienceLevel)
			u_data.experienceLevel=$scope.job.experienceLevel;
			if($scope.job.timePreference)
			u_data.timePreference=$scope.job.timePreference;
			if($scope.job.viewtype)
			u_data.viewtype=$scope.job.viewtype;
			if($scope.job.currency)
			u_data.currency=$scope.job.currency;

			u_data.status='open';
			if($scope.job.screeningQuestions)
			{
			u_data.screeningQuestions=[];
				$scope.job.screeningQuestions.forEach(function(entry){
				if(entry.text)
				u_data.screeningQuestions.push(entry.text);
				
				});
			}

			if($scope.job.skills)
			u_data.skills=JSON.parse(angular.toJson($scope.job.skills));	
			var uploadJob = firebase.database().ref('/jobs');
			var uploadJobRef = uploadJob.push(u_data);
			var myRootRef_timeline = firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/timeline');
            var collectionRef_timeline = myRootRef_timeline.push({publishAt:u_data.publishAt,title:'Job Posted',subTitle:u_data.title,description:u_data.description,type:"jobs",reference:uploadJobRef.key,statusline:""});

			var add_job_in_user = firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/jobs');
			add_job_in_user.push({jobid:uploadJobRef.key});

			 $scope.job.categories.forEach(function(entry){
			
                     var myRootRef_a = firebase.database().ref('/categoryjobs/'+entry.id);
                    myRootRef_a.push(JSON.parse(angular.toJson({job_id:uploadJobRef.key,timestamp:u_data.publishAt})));
                  });
			 if($scope.attachedfilesdata && $scope.attachedfilesdata.length>0)
			 {
			 	$scope.attachedfilesdata.forEach(function(entry1,index1){
                 var mountainsRef = storageRef.child('upload/job/'+JSON.parse(window.localStorage.getItem('info')).uid+'/'+uploadJobRef.key+'/'+entry1.name).put(entry1);
                    mountainsRef.on('state_changed', function(snapshot){
                    	 progress=parseInt(progress);
                     var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    
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
                      $scope.attachedfilesdata[index1].downloadUrl=downloadURL;
                     
                      if(index1==$scope.attachedfilesdata.length-1)
                      {
 																
					            var attachments=[];
					            $scope.attachedfilesdata.forEach(function(entry,index){
		                        attachments.push({name:entry.name,data:entry.downloadUrl});

							    	if(index==$scope.attachedfilesdata.length-1)
							    	{
							    		var attachments_refs = firebase.database().ref('/jobs/'+uploadJobRef.key+'/attachments');
   			   			 				var attachments_Ref = attachments_refs.set(attachments);
                        		


					           $ionicLoading.hide();
					           
					           var alertPopup = $ionicPopup.alert({
						     	title: 'Worklidate',
						     	template:"Job published successfully."
						   		});
		                        $location.path('/app/job/details/'+uploadJobRef.key);
		                        
							    	}

							    });
                  
                        $ionicLoading.hide();
                      }
                    }); 
                               
                                
              });

					  


			 }
			 else
			 {	 
			
				$ionicLoading.hide();
				 var alertPopup = $ionicPopup.alert({
						     	title: 'Worklidate',
						     	template:"Job published successfully."
						   		});
				$location.path('/app/job/details/'+uploadJobRef.key);	
			 }

 }
 $scope.addQuestion=function()
 {
 	if($scope.job.screeningQuestions)
 	{

 		$scope.job.screeningQuestions.push({id:$scope.job.screeningQuestions.length+1});
 	}
 	else
 	{
 	$scope.job.screeningQuestions=[];
 	$scope.job.screeningQuestions.push({id:1});
 	}
 }
  Analytics.trackPage('Post_Job');
}
];