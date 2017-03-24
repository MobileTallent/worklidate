'use strict';
module.exports = [
    '$scope','Upload','$rootScope','Firebase','$ionicLoading','$location','$ionicPopup','$stateParams','Analytics','$http',function($scope,Upload,$rootScope,Firebase,$ionicLoading,$location,$ionicPopup,$stateParams,Analytics,$http) {
 $rootScope.checkLogin();
 var storageRef = firebase.storage().ref();
 if($stateParams.contractId)
 {
 	if($stateParams.id)
 {
	 	$scope.contractId=$stateParams.contractId;
	 	$scope.milestoneId=$stateParams.id;
	  $ionicLoading.show({
	      template: 'Loading...'
	    });
 			var myRootRef_a = firebase.database().ref('/contracts/'+$stateParams.contractId+"/milestones/"+$stateParams.id);
	            myRootRef_a.once("value", function(milestone) {
	            	$scope.milestone=milestone.val();
	            	if(milestone.val())
	            	{
	            		if(milestone.val().status=="working")
	            		{
	            			console.log("yes");
	            		}
	            		else
	            		{
	            			$location.path('/app/contract/details/'+$scope.contractId);
	            		}
	            	}
	            	else
	            	{
	            		$location.path('/app/contract/details/'+$scope.contractId);
	            	}
	            	 $ionicLoading.hide();
	            });
	        }
	            
 }
 $scope.onFileSelect = function (file,type) {
  if(file[0])
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
       if(!$scope.$$phase) {
                    $scope.$apply();
                    }
      },100);
       
    
    }
 $scope.submitWork=function(milestoneMessage)
 {
 
 	if(milestoneMessage)
 	{
 		$ionicLoading.show({template: 'Loading...'});
 	 	var myRootRef_submit = firebase.database().ref('/contracts/'+$stateParams.contractId+"/milestones/"+$stateParams.id+"/status").set("submitted");
 	 	var myRootRef_update = firebase.database().ref('/contracts/'+$stateParams.contractId+"/milestones/"+$stateParams.id);
 	 	myRootRef_update.update({message:milestoneMessage});

 	 	if(milestoneMessage)
 		{
 		 	var sendDate=new Date();
 		 	
 		 	var new_data=JSON.parse(angular.toJson({message:"(Milestone Submitted) : "+milestoneMessage+" *",date:sendDate,type:'talent',subtype:"milestone_submitted",data:"/"+$stateParams.contractId+"/"+$stateParams.id,system_message:"true",status:'unread'}));
 		 	var myRootRef_proposal_message = firebase.database().ref('/contracts/'+$stateParams.contractId+"/message");
 		 	myRootRef_proposal_message.push(new_data);
			var transactions_id=null;
	 		var ref1 = firebase.database().ref("/transactions/").orderByChild('contractid').equalTo($stateParams.contractId);
        	ref1.once("value", function(snapshot) {
        		
        		for(var key in snapshot.val())
        		if(snapshot.val()[key].milestoneid==$stateParams.id && snapshot.val()[key].payment_status=='escrow')
        			transactions_id=key;

				setTimeout(function(){
				
					$http({
					          method: 'POST',
					          url: window.location.origin+'/milestones.php',
					           data: {token:$rootScope.loggedUserId,milestone:$stateParams.id,contract:$stateParams.contractId,transactions:transactions_id},
					           headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
					        }).then(function successCallback(response) {
				      
				        		
					        }, function errorCallback(response) {
					        	
					              	
					        });
				},3000);
			});
 		 	

 		 	
 		 }
 		  if($scope.attachedfilesdata && $scope.attachedfilesdata.length>0)
			 {
			 	$scope.attachedfilesdata.forEach(function(entry1,index1){
                 var mountainsRef = storageRef.child('upload/milestone/'+JSON.parse(window.localStorage.getItem('info')).uid+'/'+$stateParams.contractId+'/'+entry1.name).put(entry1);
                    mountainsRef.on('state_changed', function(snapshot){
                    	 progress=parseInt(progress);
                     var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                     
					            $ionicLoading.show({
					     		 template: 'Upload is ' + progress + '% done'
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
					    		var attachments_refs = firebase.database().ref('/contracts/'+$stateParams.contractId+"/milestones/"+$stateParams.id+'/attachments');
		   			 				var attachments_Ref = attachments_refs.set(attachments);
		   			 				$scope.milestone.attachments=attachments;
		   			 				firebase.database().ref('/contracts/'+$stateParams.contractId+"/allSubmittedMilestonesData").push($scope.milestone);
                					$ionicLoading.hide();
		   			 				$location.path('/app/contract/details/'+$scope.contractId);
                        
					    	}


					    });
                      }
                    }); 
                               
                                
              });

					  


			 }
			 else
			 {	 
			 	firebase.database().ref('/contracts/'+$stateParams.contractId+"/allSubmittedMilestonesData").push($scope.milestone);
			 	$ionicLoading.hide();
					$location.path('/app/contract/details/'+$scope.contractId);
			 }
 		 
 	}
 };
 Analytics.trackPage('Submit_Milestone');
}
];