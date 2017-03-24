'use strict';
module.exports = [
    '$scope','Firebase','$rootScope','$ionicLoading','$http','$ionicPopup','$ionicModal','Analytics','$ionicActionSheet', function($scope,Firebase,$rootScope,$ionicLoading,$http,$ionicPopup,$ionicModal,Analytics,$ionicActionSheet) {
  $rootScope.checkLogin();
  if($rootScope.userdata){
       $scope.userLocalTime=new Date(getTime($rootScope.userdata.timeoffset));
  }
  else
  {
    setTimeout(function(){
      if($rootScope.userdata){
          $scope.userLocalTime=new Date(getTime($rootScope.userdata.timeoffset));
      }
    },5000);
  }
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
           // url: 'templates/timeLine.tpl.html'
        //},
        {
            title: 'About',
            url: 'templates/views/about.tpl.html'
        },
        {
            title: 'Projects',
            url: 'templates/views/project.tpl.html'
        },
        {
            title: 'Jobs',
            url: 'templates/views/jobs.tpl.html'
        },{
            title: 'Comments',
            url: 'templates/views/comments.tpl.html'
        }
    ];

    $scope.currentTab = 'templates/views/about.tpl.html';

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
    
    if(window.localStorage.getItem('info'))
    {
      var jobsRef = firebase.database().ref('/jobs/');
    jobsRef.orderByChild('userid').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).on("value", function(jobs) {
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
    proposalRef.orderByChild('talent_id').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).on("value", function(proposals) {
        $scope.userWorkingContracts=[];
        $scope.userEndContracts=[];
        for(var key in proposals.val()){
                var d=proposals.val()[key];
                d.id=key;

                if(proposals.val()[key].status=="end" || proposals.val()[key].status=="completed")
                    $scope.userEndContracts.push(d);
                  
                 if(proposals.val()[key].status=="open")
                    $scope.userWorkingContracts.push(d);

            }
              if(!$scope.$$phase) {
                    $scope.$apply();
                    }
    });
    }
    $scope.availableForHiring=function()
    {
      
     
      if($rootScope.userdata.billaddress)
          {
      if($rootScope.userdata.hourlyRateHKD)
          {
            if($rootScope.userdata.hourlyRateUSD)
          {
          if($rootScope.userdata.picture)
          {
            if($rootScope.userdata.title)
            {
               if($rootScope.userdata.location)
                {
                  
                      if($rootScope.userdata.profession)
                      {
                         var ref = firebase.database().ref();
                          ref.child("users").child(JSON.parse(window.localStorage.getItem('info')).uid).update({
                          availableForHiring:true
                          });
                       }
                       else
                       {
                           $ionicPopup.alert({
                            title: 'Required!',
                            content: 'Please set the categories.'
                            }).then(function(res) {
                            console.log('Test Alert Box');
                            });
                        }
                   
                }
                else
                {
                     $ionicPopup.alert({
                      title: 'Required!',
                      content: 'Please set the location.'
                      }).then(function(res) {
                      console.log('Test Alert Box');
                      });
                }
            }
            else
            {
                 $ionicPopup.alert({
                  title: 'Required!',
                  content: 'Please set the profile title.'
                  }).then(function(res) {
                  console.log('Test Alert Box');
                  });
            }
          }
          else
          {
             $ionicPopup.alert({
              title: 'Required!',
              content: 'Please set the profile picture.'
              }).then(function(res) {
              console.log('Test Alert Box');
              });
          }
        }
        else
          {
             $ionicPopup.alert({
              title: 'Required!',
              content: 'Please set the USD Hour rate.'
              }).then(function(res) {
              console.log('Test Alert Box');
              });
          }
        }else
          {
             $ionicPopup.alert({
              title: 'Required!',
              content: 'Please set the HKD hour rate.'
              }).then(function(res) {
              console.log('Test Alert Box');
              });
          }
          }else
          {
             $ionicPopup.alert({
              title: 'Required!',
              content: 'Please set billing address.'
              }).then(function(res) {
              console.log('Test Alert Box');
              });
          }
    }

    $scope.NotavailableForHiring=function()
    {
         var ref = firebase.database().ref();
                   ref.child("users").child(JSON.parse(window.localStorage.getItem('info')).uid).update({
                availableForHiring:false
              });
    }

    var ref = firebase.database().ref("/projects");
        ref.orderByChild('userid').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).on("value", function(projects) {
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
 var proposalRef = firebase.database().ref('/contracts/');
    proposalRef.orderByChild('talent_id').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).on("value", function(proposals) {
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
    proposalRef.orderByChild('employer_id').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).on("value", function(proposals) {
        $scope.employerWorkingContracts=[];
        $scope.employerEndContracts=[];
        for(var key in proposals.val()){
                var d=proposals.val()[key];
                d.id=key;

                if(proposals.val()[key].status=="open")
                    $scope.employerWorkingContracts.push(d);
                  if(proposals.val()[key].status=="end" || proposals.val()[key].status=="completed")
                    $scope.employerEndContracts.push(d);

            }
              if(!$scope.$$phase) {
                    $scope.$apply();
                    }
    });

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
 Analytics.trackPage('My_Profile');
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