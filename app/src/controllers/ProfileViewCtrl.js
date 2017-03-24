'use strict';
module.exports = [
    '$scope','Firebase','$rootScope','$ionicLoading','$http','$stateParams','$ionicModal','Analytics','$ionicActionSheet',function($scope,Firebase,$rootScope,$ionicLoading,$http,$stateParams,$ionicModal,Analytics,$ionicActionSheet) {
$scope.userid=$stateParams.id;
if(window.localStorage.getItem('info'))
$scope.loggedUserId=JSON.parse(window.localStorage.getItem('info')).uid;
   $ionicLoading.show({
      template: 'Loading...'
    });
     $ionicModal.fromTemplateUrl('stats.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
   $ionicModal.fromTemplateUrl('connections.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.connectionmodel = modal;
  });
  $scope.viewStats=function()
  {
  $scope.modal.show();
  }
  $scope.viewConnection=function()
  {
  $scope.connectionmodel.show();
  }
   $scope.tabs = [//{
            //title: 'Time Line',
            //url: 'templates/timeLine_view.tpl.html'
        //},
        {
            title: 'About',
            url: 'templates/views/about_view.tpl.html'
        },
        {
            title: 'Projects',
            url: 'templates/views/project.tpl.html'
        },
        {
            title: 'Jobs',
            url: 'templates/views/jobs_view.tpl.html'
        },{
            title: 'Comments',
            url: 'templates/views/comments_view.tpl.html'
        }
    ];

    $scope.currentTab = 'templates/views/about_view.tpl.html';

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    }
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }
    $scope.comment=[];
    $scope.getdevider=function(asTalent,asEmployer)
    {
      if(asTalent && asEmployer)
        return 2;
      else if(asTalent || asEmployer)
        return 1;
      else
        return 1;

    }
     $scope.getTotalRatings=function(asTalent,asEmployer)
    {
      if(asTalent && asEmployer)
        return (($rootScope.calculateRating(asTalent)/$rootScope.getObjectLength(asTalent))+($rootScope.calculateRating(asEmployer)/$rootScope.getObjectLength(asEmployer)));
      else if(asTalent)
        return ($rootScope.calculateRating(asTalent)/$rootScope.getObjectLength(asTalent));
      else if(asEmployer)
        return ($rootScope.calculateRating(asEmployer)/$rootScope.getObjectLength(asEmployer));
      else
        return 0;

    }
    

    $scope.showRatings=function(type,asTalent,asEmployer)
    {

      $scope.comment.show=false;
      $scope.attitude=0;
      $scope.understanding=0;
      $scope.communication=0;
      $scope.payment=0;
      $scope.responsibility=0;
      $scope.totalRatings=0;
      if(type=='all')
      {
        $scope.totalRatings=$rootScope.getObjectLength(asTalent) + $rootScope.getObjectLength(asEmployer);
       $scope.totalavgRating=($scope.getTotalRatings(asTalent,asEmployer));
        if($rootScope.getObjectLength(asTalent)){
          $scope.comment.show=true;
                for(var key in asTalent)
                {
                 
                  $scope.attitude=$scope.attitude+parseInt(asTalent[key].attitude);
                  $scope.understanding=$scope.understanding+parseInt(asTalent[key].understanding);
                  $scope.communication=$scope.communication+parseInt(asTalent[key].communication);
                  $scope.payment=$scope.payment+parseInt(asTalent[key].payment);
                  $scope.responsibility=$scope.responsibility+parseInt(asTalent[key].responsibility);
        
                }
            }
             if($rootScope.getObjectLength(asEmployer)){
              $scope.comment.show=true;
        for(var key in asEmployer)
        {
         
          $scope.attitude=$scope.attitude+parseInt(asEmployer[key].attitude);
          $scope.understanding=$scope.understanding+parseInt(asEmployer[key].understanding);
          $scope.communication=$scope.communication+parseInt(asEmployer[key].communication);
          $scope.payment=$scope.payment+parseInt(asEmployer[key].payment);
          $scope.responsibility=$scope.responsibility+parseInt(asEmployer[key].responsibility);

        }
      }
      }
      if(type=='from_employer')
      {
        $scope.totalRatings=$rootScope.getObjectLength(asTalent) ;
        $scope.totalavgRating=($scope.getTotalRatings(asTalent));
         if($rootScope.getObjectLength(asTalent)){
           $scope.comment.show=true;
        for(var key in asTalent)
        {
         
          $scope.attitude=$scope.attitude+parseInt(asTalent[key].attitude);
          $scope.understanding=$scope.understanding+parseInt(asTalent[key].understanding);
          $scope.communication=$scope.communication+parseInt(asTalent[key].communication);
          $scope.payment=$scope.payment+parseInt(asTalent[key].payment);
          $scope.responsibility=$scope.responsibility+parseInt(asTalent[key].responsibility);

        }
      }
      }
      if(type=='from_talents')
      {
       $scope.totalRatings=$rootScope.getObjectLength(asEmployer);
       $scope.totalavgRating=($scope.getTotalRatings(asEmployer));
        if($rootScope.getObjectLength(asEmployer)){
           $scope.comment.show=true;
        for(var key in asEmployer)
        {
         
          $scope.attitude=$scope.attitude+parseInt(asEmployer[key].attitude);
          $scope.understanding=$scope.understanding+parseInt(asEmployer[key].understanding);
          $scope.communication=$scope.communication+parseInt(asEmployer[key].communication);
          $scope.payment=$scope.payment+parseInt(asEmployer[key].payment);
          $scope.responsibility=$scope.responsibility+parseInt(asEmployer[key].responsibility);

        }
      }
      }
    }
     var jobsRef = firebase.database().ref('/jobs/');
    jobsRef.orderByChild('userid').equalTo($scope.userid).on("value", function(jobs) {
        $scope.userOpenJobs=[];
        $scope.userClosedJobs=[];
        $scope.userWorkingJobs=[];
        for(var key in jobs.val()){
                var d=jobs.val()[key];
                d.id=key;
                   // $scope.userOpenJobs.push(d);
                
                if(jobs.val()[key].status=="end" || jobs.val()[key].status=="completed")
                    $scope.userClosedJobs.push(d);
                if(jobs.val()[key].status=="working")
                    $scope.userWorkingJobs.push(d);
                if(jobs.val()[key].status=="open")
                    $scope.userOpenJobs.push(d);
            }
              if(!$scope.$$phase) {
                    $scope.$apply();
                    }
    });
    var proposalRef = firebase.database().ref('/contracts/');
    proposalRef.orderByChild('talent_id').equalTo($scope.userid).on("value", function(proposals) {
        $scope.telentWorkingContracts=[];
        $scope.telentEndContracts=[];
        for(var key in proposals.val()){
                var d=proposals.val()[key];
                d.id=key;

                if(proposals.val()[key].status=="open")
                    $scope.telentWorkingContracts.push(d);
                  if(proposals.val()[key].status=="end" || proposals.val()[key].status=="completed")
                    $scope.telentEndContracts.push(d);

            }
              if(!$scope.$$phase) {
                    $scope.$apply();
                    }
    });
    var proposalRef = firebase.database().ref('/contracts/');
    proposalRef.orderByChild('employer_id').equalTo($scope.userid).on("value", function(proposals) {
        
        $scope.employerWorkingContracts=[];
        $scope.employerEndContracts=[];
        for(var key in proposals.val()){
          console.log(proposals.val()[key].status);
                var d=proposals.val()[key];
                d.id=key;

                if(proposals.val()[key].status=="open")
                {
                    $scope.employerWorkingContracts.push(d);
                }
               if(proposals.val()[key].status=="end" || proposals.val()[key].status=="completed")
                  {
                  
                    $scope.employerEndContracts.push(d);
                  }

            }
              if(!$scope.$$phase) {
                    $scope.$apply();
                    }
    });
     var ref = firebase.database().ref("/users/"+$scope.userid);
        ref.on("value", function(snapshot) {
         $rootScope.viewUser=snapshot.val();
         if($rootScope.viewUser.timeoffset){
             $scope.userLocalTime=new Date(getTime($rootScope.viewUser.timeoffset));
        }
         });

      var ref = firebase.database().ref("/projects");
        ref.orderByChild('userid').equalTo($scope.userid).once("value", function(projects) {
        $rootScope.user_projects=[];
       for(var key in projects.val())
        {
            var d=projects.val()[key];
            d.id=key;
            $rootScope.user_projects.push(d);
        }
      
        
          $ionicLoading.hide();
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
          $ionicLoading.hide();
        });
            var ref = firebase.database().ref("/groups");
        ref.orderByChild('owner_userid').equalTo($scope.userid).once("value", function(groups) {
     
        $scope.user_groups=groups.val();
      
          $ionicLoading.hide();
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
          $ionicLoading.hide();
        });
    $scope.like=function()
    {
      if($scope.userid!=$scope.loggedUserId)
      {
          var ref = firebase.database().ref("/users/"+$scope.userid+"/liker");
            ref.orderByChild('userid').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).once("value", function(snapshot) {
         if(snapshot.val()==null)
         {
          ref.push({userid:JSON.parse(window.localStorage.getItem('info')).uid});
            var ref1 = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/likes");
            ref1.orderByChild('userid').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).once("value", function(snapshot) {
             if(snapshot.val()==null)
             {
              ref1.push({userid:$scope.userid});
             }

             });
         }

         });
          }
    }
 $scope.unlike=function()
    {
       if($scope.userid!=$scope.loggedUserId)
      {
          var ref = firebase.database().ref("/users/"+$scope.userid+"/liker");
            ref.orderByChild('userid').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).once("value", function(snapshot) {
         if(snapshot.val())
         {
            for(var key in snapshot.val())
            {
              var ref1 = firebase.database().ref("/users/"+$scope.userid+"/liker/"+key);
              ref1.remove();
              var ref2 = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/likes");
                ref2.orderByChild('userid').equalTo($scope.userid).once("value", function(snapshot) {
             if(snapshot.val())
             {
                for(var key in snapshot.val())
                {
                  var ref2 = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/likes/"+key);
                  ref2.remove();
                }
             }

             });
            }
         }

         });
          }
    }

    $scope.follow=function()
    {
       if($scope.userid!=$scope.loggedUserId)
      {
    
          var ref = firebase.database().ref("/users/"+$scope.userid+"/followers");
            ref.orderByChild('userid').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).once("value", function(snapshot) {
         if(snapshot.val()==null)
         {
          ref.push({userid:JSON.parse(window.localStorage.getItem('info')).uid});
            var ref1 = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/follows");
            ref1.orderByChild('userid').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).once("value", function(snapshot) {
             if(snapshot.val()==null)
             {
              ref1.push({userid:$scope.userid});
             }

             });
         }

         });
          }
    }
 $scope.unfollow=function()
    {
       if($scope.userid!=$scope.loggedUserId)
      {
          var ref = firebase.database().ref("/users/"+$scope.userid+"/followers");
            ref.orderByChild('userid').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).once("value", function(snapshot) {
         if(snapshot.val())
         {
            for(var key in snapshot.val())
            {
              var ref1 = firebase.database().ref("/users/"+$scope.userid+"/followers/"+key);
              ref1.remove();
              var ref2 = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/follows");
                ref2.orderByChild('userid').equalTo($scope.userid).once("value", function(snapshot) {
             if(snapshot.val())
             {
                for(var key in snapshot.val())
                {
                  var ref2 = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/follows/"+key);
                  ref2.remove();
                }
             }

             });
            }
         }

         });
          }
    }
   


    if(window.localStorage.getItem('info'))
{
     var ref = firebase.database().ref("/users/"+$scope.userid+"/views");
        ref.orderByChild('userid').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).once("value", function(snapshot) {
         if(snapshot.val()==null)
         {
          ref.push({userid:JSON.parse(window.localStorage.getItem('info')).uid});
          var ref1 = firebase.database().ref("/views/profile/");
            ref1.push({userid:$scope.userid});
         }

         });
      }
 $scope.MoreOptions=function(data,id)
{
if(data)
  {
  // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
      { text: 'Translate' },
       ],
     cancelText: 'Cancel',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
    
      if(index==0)
      {
      var text=data;

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
  
}
         Analytics.trackPage('View_Profile');
}
];
function getTime(offset)
        {
          var localTime,d,localOffset,utc;
           d = new Date();
         localTime = d.getTime();
            localOffset = d.getTimezoneOffset() * 60000;

            // obtain UTC time in msec
            utc = localTime + localOffset;
            // create new Date object for different city
            // using supplied offset
            var nd = new Date(utc + (3600000*offset));
            //nd = 3600000 + nd;
            utc = new Date(utc);
            // return time as a string
            return nd.toLocaleString();
            //$("#local").html(nd.toLocaleString());
            //$("#utc").html(utc.toLocaleString());
        }