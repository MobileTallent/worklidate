'use strict';
module.exports = [
 '$scope','$rootScope','$ionicLoading','$location','$stateParams','$ionicModal','$ionicPopup','$ionicActionSheet','ngDialog','$http','Analytics',function($scope,$rootScope,$ionicLoading,$location,$stateParams,$ionicModal,$ionicPopup,$ionicActionSheet,ngDialog,$http,Analytics) {

$scope.currentURL=window.location.href;
 $scope.projectid=$stateParams.id;
 if(window.localStorage.getItem('info'))
$scope.loggedUserId=JSON.parse(window.localStorage.getItem('info')).uid;
 if($scope.projectid)
{

$ionicLoading.show({
			      template: 'Loading...'
			    });
 var ref = firebase.database().ref("/projects/"+$scope.projectid);
 ref.on("value", function(project) {
	$scope.project=project.val();
	$ionicLoading.hide();
  $scope.metaimg='';
if($scope.project.images)
  $scope.metaimg=$scope.project.images[0]
$('head').append('<meta property="og:title" content="'+$scope.project.projectTitle+'" /><meta property="og:type" content="article" /><meta property="og:url" content="'+$scope.currentURL+'" /><meta property="og:image" content="'+$scope.metaimg+'" /><meta property="og:description" content="'+$scope.project.description+'" /> <meta property="og:site_name" content="www.worklidate.com" />');
if(!$scope.relatedprojects)
{
  $scope.randomMum=Math.floor((Math.random() * 10) + 1);

 $scope.relatedprojects=[];

for(var key in $scope.project.categories)
        {
        
          var myRootRef_a = firebase.database().ref('/search/projects');
            myRootRef_a.once("value", function(projects) {
              $scope.randomMum=[];
              var len=$rootScope.getObjectLength(projects.val());
              $scope.randomMum.push(Math.floor((Math.random() * len) + 1));
              $scope.randomMum.push(Math.floor((Math.random() * len) + 1));
              $scope.randomMum.push(Math.floor((Math.random() * len) + 1));
              $scope.randomMum.push(Math.floor((Math.random() * len) + 1));
              $scope.randomMum.push(Math.floor((Math.random() * len) + 1));
              $scope.randomMum.push(Math.floor((Math.random() * len) + 1));
              $scope.randomMum.push(Math.floor((Math.random() * len) + 1));
          for(var key1 in projects.val())
           {
           var i = Object.keys(projects.val()).indexOf(key1);
           if($scope.randomMum.indexOf(i)>-1)
            if(projects.val()[key1].project_id!=$scope.projectid && $scope.relatedprojects.length<3)
              $scope.relatedprojects.push(projects.val()[key1]);
           
            }
            
         });
        
        } 
        setTimeout(function(){
          console.log($scope.relatedprojects);
          console.log($scope.randomMum);
        },5000);
      }

  if(project.val())
  {
    if($scope.projectid)
    {
   var ref2 = firebase.database().ref("/projects/"+$scope.projectid+"/views");
          ref2.orderByChild('userid').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).once("value", function(snapshot) {
           if(snapshot.val()==null)
           {
           
            ref2.push({userid:JSON.parse(window.localStorage.getItem('info')).uid});
            var ref1 = firebase.database().ref("/views/project");
              ref1.push({projectid:$scope.projectid});
           }

           });
    }
  }
 });
 }
 $scope.like=function(projectOwner)
    {
      if($scope.projectid)
      {
          var ref = firebase.database().ref("/projects/"+$scope.projectid+"/likes");
            ref.orderByChild('userid').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).once("value", function(snapshot) {
         if(snapshot.val()==null)
         {
          ref.push({userid:JSON.parse(window.localStorage.getItem('info')).uid});
            var ref1 = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/projectlikes");
            ref1.orderByChild('projectid').equalTo($scope.projectid).once("value", function(snapshot) {
             if(snapshot.val()==null)
             {
              ref1.push({projectid:$scope.projectid});
              
               var ref2 = firebase.database().ref("/users/"+projectOwner+"/project_likers");
              ref2.push({projectid:$scope.projectid,userid:JSON.parse(window.localStorage.getItem('info')).uid});
             }

             });
         }

         });
          }
    }
 $scope.unlike=function(projectOwner)
    {
      if($scope.projectid)
      {
          var ref = firebase.database().ref("/projects/"+$scope.projectid+"/likes");
            ref.orderByChild('userid').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).once("value", function(snapshot) {
         if(snapshot.val())
         {
            for(var key in snapshot.val())
            {
              var ref1 = firebase.database().ref("/projects/"+$scope.projectid+"/likes/"+key);
              ref1.remove();
              var ref2 = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/projectlikes");
                ref2.orderByChild('projectid').equalTo($scope.projectid).once("value", function(snapshot1) {
             if(snapshot1.val())
             {
                for(var key1 in snapshot1.val())
                {
                  var ref3= firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/projectlikes/"+key1);
                  ref3.remove();
                }
             }

             });

                var ref3 = firebase.database().ref("/users/"+projectOwner+"/project_likers");
                ref3.orderByChild('projectid').equalTo($scope.projectid).once("value", function(snapshot1) {
                 if(snapshot1.val())
                 {
                    for(var key1 in snapshot1.val())
                    {
                      if(snapshot1.val()[key1].userid==JSON.parse(window.localStorage.getItem('info')).uid)
                      {
                      var ref4= firebase.database().ref("/users/"+projectOwner+"/project_likers/"+key1);
                      ref4.remove();
                    }
                    }
                 }

             });
            }
         }

         });
          }
    }
    $scope.data=[];
    $scope.send=function()
    {
	    if($scope.data.message)
	    {
	    		var s_data= {userid:JSON.parse(window.localStorage.getItem('info')).uid,comment:$scope.data.message,publishAt:new Date()};
        		var new_data=JSON.parse(angular.toJson(s_data));
				var ref = firebase.database().ref("/projects/"+$scope.projectid+"/comments");
				ref.push(new_data);	 

				var s_data= {projectid:$scope.projectid,comment:$scope.data.message,publishAt:new Date(),type:'project'};
        		var new_data=JSON.parse(angular.toJson(s_data));
				var ref1 = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/comments");
				ref1.push(new_data);
				$scope.data.message=[];	   
	    }

    }

   $ionicModal.fromTemplateUrl('share.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.share=function()
  {
  $scope.modal.show();
  }
  $scope.showLikers = function(likesData) {
  $rootScope.likesData=likesData;
        ngDialog.open({ template: 'templates/likes.html', className: 'ngdialog-theme-default' });
    };


    $scope.moreoptions=function(id,data)
    {
      // Show the action sheet
       var hideSheet = $ionicActionSheet.show({
         buttons: [
          { text: 'Translate' },
           ],
      
         buttonClicked: function(index) {
      
          if(index==0)
          {
          var text=$('#'+id).html();
        
           $('#'+id).html("<img src='img/smallloading.gif' style='height:16px;width:28px'/>");
          
          var url=window.location.origin+'/translation.php';

            $http({
                          method: 'POST',
                          url: url,
                           data: { text:text},
                           headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                        }).then(function successCallback(response) {
                      
                           $('#'+id).html(response.data.text);

                          }, function errorCallback(response) {
                          console.log(response);
                          });
          }
          
           return true;
         }
       });
  }
  $scope.supported = false;

      

        $scope.success = function () {
          $scope.modal.hide();
        };

        $scope.fail = function (err) {
            console.error('Error!', err);
        };
   Analytics.trackPage('Project_Details');
}
];
