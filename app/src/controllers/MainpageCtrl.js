'use strict';

/**
 * @ngdoc function
 * @name Worklidate.controller:MainController
 * @description
 * # MainController
 */
module.exports = [
    '$scope','$rootScope','$ionicModal','$ionicPopover','Firebase','$location','$ionicLoading','$filter', '$state','$ionicSideMenuDelegate',

    function($scope,$rootScope,$ionicModal,$ionicPopover,Firebase,$location,$ionicLoading,$filter, $state,$ionicSideMenuDelegate)
    {
$scope.searchFilters=[];
$scope.searchFilters.categories=[];
$scope.projectsearch='';
if(window.localStorage.getItem('home_sortdata'))
{
  $scope.projectsearch=window.localStorage.getItem('home_term');
  $scope.projectsearch_filter=window.localStorage.getItem('home_term');
  $rootScope.ProjectFilterOn=true;
  $scope.searchFilters.sort=window.localStorage.getItem('home_sortdata');
  $scope.searchFilters.timeDuration=window.localStorage.getItem('home_timeDuration');
  $scope.searchFilters.categories=JSON.parse(window.localStorage.getItem('home_categories'));

  if($scope.searchFilters.timeDuration=='customer_range')
  {   
    $scope.searchFilters.customer_rangeto=window.localStorage.getItem('home_timeDuration_customer_rangeto');
    $scope.searchFilters.customer_rangefrom=window.localStorage.getItem('home_timeDuration_customer_rangefrom');
  }
}
else
{

  $scope.searchFilters.sort='latest';
  $scope.searchFilters.timeDuration='all';

}
$ionicModal.fromTemplateUrl('mainpagesort.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.model = modal;
  });
 $scope.viewmainSorts=function()
  {
  $scope.model.show();
  }

$scope.reset=function () {
  $rootScope.ProjectFilterOn=false;
  $scope.searchFilters.sort='latest';
    $scope.projectsearch='';
  $scope.projectsearch_filter='';
  $scope.searchFilters.timeDuration='all';
  window.localStorage.removeItem('home_term');
   window.localStorage.removeItem('home_sortdata');
   window.localStorage.removeItem('home_timeDuration');
    window.localStorage.removeItem('home_categories');
    $scope.searchFilters.categories=[];
}

$scope.moreDataCanBeLoaded=false;
if($rootScope.refreshHomePage==true)
{
  $rootScope.refreshHomePage=false;
   
    location.reload();
}


 window.history.go(-window.history.length);
$('.mainpage-banner').css("height",($(document).height()/3));
$ionicLoading.show({
               template: 'Loading...'
              });
 $scope.hideAds=function()
 {
      document.getElementById("mainpage-banner-outer").style.display="none";
 } 
 $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
$scope.pageReload=function()
{
   location.reload();
}
$scope.loadedProjects=0;
$scope.loadMore=function()
{

  //New Loadmore
if($scope.allhomePageProjects){
setTimeout(function(){ 
  if($scope.allhomePageProjects.length>=$scope.loadedProjects)
  {
  $scope.loadedProjects=$scope.loadedProjects+5;
  for(var p=$scope.loadedProjects;p<$scope.loadedProjects+5;p++)
  {

    if($scope.allhomePageProjects[p])
       $scope.homePageProjects.push($scope.allhomePageProjects[p]);

       $scope.$broadcast('scroll.infiniteScrollComplete');
  }
  }
    else
    {
     $scope.moreDataCanBeLoaded=false;
     $scope.$broadcast('scroll.infiniteScrollComplete');
    }
     },1000);
  }

 //Old Loadmore
/*if($scope.allOrderedhomePageProjects){
setTimeout(function(){ 
  if($scope.allOrderedhomePageProjects.length>=$scope.loadedProjects)
  {
 
  $scope.loadedProjects=$scope.loadedProjects+5;
   { 

   for(var p=$scope.loadedProjects;p<$scope.loadedProjects+5;p++)
   {
     
     if($scope.allOrderedhomePageProjects[p])
       $scope.homePageProjects.push($scope.allOrderedhomePageProjects[p]);
                     };
     
        $scope.$broadcast('scroll.infiniteScrollComplete');
     
    }
    }
    else
    {
     $scope.moreDataCanBeLoaded=false;
     $scope.$broadcast('scroll.infiniteScrollComplete');
    }
     },1000);
  }*/

}

$scope.sortdata=function(type)
{
  $rootScope.ProjectFilterOn=true;
  window.localStorage.setItem('home_sortdata',type);
    $ionicLoading.show({
               template: 'Searching...'
              });
  if(type=='latest' || type=='select')
  {
    $scope.homePageProjects=$filter('orderBy')($scope.homePageProjects,'-publishAt');
  }
  if(type=='mostcommented')
  {
    $scope.homePageProjects=$filter('orderBy')($scope.homePageProjects,'-commnetscount');
  }
  if(type=='mostviewed')
  {
    $scope.homePageProjects=$filter('orderBy')($scope.homePageProjects,'-viewscount');
  }
  
  setTimeout(function(){
               $ionicLoading.hide();
              },3000);
}

$scope.applyFilter=function(time,sort,term)
{
   $ionicLoading.show({
               template: 'Searching...'
              });
    if(sort=='latest' && !term && time=='all' && (!$scope.searchFilters.categories || $scope.searchFilters.categories.length==0))
  {
    $scope.reset();
  }
  else
  {
      $rootScope.ProjectFilterOn=true;
    if(term)
    {
     $scope.projectsearch=term;
    window.localStorage.setItem('home_term',term);
    }
    else
     {
      $scope.projectsearch='';
      window.localStorage.setItem('home_term','');
      }
     
      window.localStorage.setItem('home_timeDuration',time);
      window.localStorage.setItem('home_sortdata',sort);
 
      if($scope.searchFilters.timeDuration=='customer_range')
      {   
         window.localStorage.setItem('home_timeDuration_customer_rangeto',$scope.searchFilters.customer_rangeto);
        window.localStorage.setItem('home_timeDuration_customer_rangefrom',$scope.searchFilters.customer_rangefrom);
      }
}
if($scope.searchFilters.categories!=null && $scope.searchFilters.categories.length>0)
{
  console.log("getFilteredCategoryProject");
   $scope.getFilteredCategoryProject();
   window.localStorage.setItem('home_categories',JSON.stringify($scope.searchFilters.categories));
}
else{

  console.log("all project");
  $scope.loadedProjects=0;
  $scope.getAllProject();
}
}
$scope.getFilteredCategoryProject=function()
{
        
        
        var today=$filter('date')(new Date(),'dd/MM/yy');
        $scope.homePageProjects = [];
        var keys = [];
        $scope.searchFilters.categories.forEach(function(searchCat,index){
          console.log("1");
            $scope.allhomePageProjects.forEach(function(entry){
              if(keys.indexOf(entry.id)<0)
                        {
              console.log("2");
              if(entry.categories)
              {
                  entry.categories.forEach(function(catPrroject){
                    console.log("3 : catPrroject.name : searchCat");
                      if(catPrroject.name==searchCat.name)
                      {
                        
                          console.log(keys.indexOf(entry.id));
                          if($scope.searchFilters.timeDuration=='all')
                          {
                            keys.push(entry.id);
                            $scope.homePageProjects.push(entry);
                            
                            if(!$scope.$$phase) {
                                $scope.$apply();
                                }
                            
                          }
                          if($scope.searchFilters.timeDuration=='today')
                          {
                            
                              if(today==$filter('date')(entry.publishAt,'dd/MM/yy'))
                              {
                                keys.push(entry.id);
                                $scope.homePageProjects.push(entry);
                              }
                            
                          
                          }
                          if($scope.searchFilters.timeDuration=='this_week')
                          {
                           
                            var today_d=$filter('date')(new Date(),'dd');
                            var today_m=$filter('date')(new Date(),'MM');
                            var today_y=$filter('date')(new Date(),'yy');

                            var n = new Date().getDay();
                             
                            if(today_y==$filter('date')(entry.publishAt,'yy'))
                              if(today_m==$filter('date')(entry.publishAt,'MM'))
                                if((today_d-$filter('date')(entry.publishAt,'dd'))<=n)
                                {
                                   keys.push(entry.id);
                                  $scope.homePageProjects.push(entry);
                                }
                            
                          }
                         if($scope.searchFilters.timeDuration=='customer_range' && $scope.searchFilters.customer_rangeto && $scope.searchFilters.customer_rangefrom)
                          {
                            var temp_to=$scope.searchFilters.customer_rangeto.split('-');
                            var temp_from=$scope.searchFilters.customer_rangefrom.split('-');
                              var to=CompareDate(temp_to[1]+'-'+temp_to[0]+'-'+temp_to[2],($filter('date')(entry.publishAt,'MM-dd-yyyy')));
                              var from=CompareDate(temp_from[1]+'-'+temp_from[0]+'-'+temp_from[2],($filter('date')(entry.publishAt,'MM-dd-yyyy')));
                            
                              if(to && !from)
                              {
                                 keys.push(entry.id);
                                  $scope.homePageProjects.push(entry);
                              }
                              
                            
                          }  
                      }
                  });
               } 
               }     
            });
            if(index==$scope.searchFilters.categories.length-1)
            {
              
              $scope.loadedProjects=$scope.allhomePageProjects.length;
              setTimeout(function(){
                if($scope.searchFilters.sort=='latest')
                    {
                     $scope.allhomePageProjects=$filter('orderBy')($scope.allhomePageProjects,'-publishAt');
                    }
      
                    if($scope.searchFilters.sort=='mostcommented')
                    {
                      $scope.allhomePageProjects=$filter('orderBy')($scope.allhomePageProjects,'-commnetscount');
                    }
                    if($scope.searchFilters.sort=='mostviewed')
                    {
                      $scope.allhomePageProjects=$filter('orderBy')($scope.allhomePageProjects,'-viewscount');
                    }
                      


              $ionicLoading.hide();
            },2000); 
            }
        });
       
          
         
}

$scope.getCategoryProject=function()
{
        
        $scope.allhomePageProjects=[];
        setTimeout(function(){
          if($scope.allhomePageProjects.length<=3){
                    $scope.moreDataCanBeLoaded=false;
                     $ionicLoading.hide();
                  $scope.$broadcast('scroll.refreshComplete');
                
                  }
        },5000);
        var allUniquehomePageProjects = [],keys = [];
      
      //get user interested categories project
     /* if(!$rootScope.userdata)
      {
      window.localStorage.removeItem('info');
            delete $rootScope.userdata;
            $state.go('app.login');
            location.reload();
      }*/
    if(!$rootScope.userdata.interested_categories && !$rootScope.userdata.follows)
    {

                  $ionicLoading.hide();
                  $scope.$broadcast('scroll.refreshComplete');
    }

       for(key in $rootScope.userdata.interested_categories)
        {
        

          var myRootRef_a = firebase.database().ref('/categoryprojects/'+$rootScope.userdata.interested_categories[key].id);
            myRootRef_a.orderByChild("timestamp").limitToLast(25).once("value", function(projects) {
            for(var key1 in projects.val())
            {
              $scope.allhomePageProjects.push(projects.val()[key1]);
              if(!$scope.$$phase) {
                    $scope.$apply();
                    }
            }
            
         });
        
        } 
        for(key in $rootScope.userdata.follows)
        {
        
          var get_follows_projects = firebase.database().ref('/projects');
          get_follows_projects.orderByChild('userid').equalTo($rootScope.userdata.follows[key].userid).once("value", function(projects) {
           
            for(var key1 in projects.val())
             {
                $scope.allhomePageProjects.push({project_id:key1,timestamp:projects.val()[key1].publishAt,type:"Following"});
                if(!$scope.$$phase) {
                    $scope.$apply();
                    }
               
             }  
          });
        
        }  
         setTimeout(function(){
          angular.forEach($scope.allhomePageProjects, function(item,index) {
              var key = item['project_id'];
              if(keys.indexOf(key) === -1) {
                  keys.push(key);
                  allUniquehomePageProjects.push(item);
              }
              if(index==$scope.allhomePageProjects.length-1)
              {

                 $scope.allOrderedhomePageProjects=$filter('orderBy')(allUniquehomePageProjects,'-timestamp');
                  $scope.homePageProjects=[];
                  for(var p=0;p<5;p++){
                    if($scope.allOrderedhomePageProjects[p])
                     $scope.homePageProjects.push($scope.allOrderedhomePageProjects[p]);
                    };
                   if(!$scope.$$phase) {
                    $scope.$apply();
                    }
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                    if($scope.allOrderedhomePageProjects.length>=3)
                    $scope.moreDataCanBeLoaded=true;
                }
          
        });
         
        },5000);
}

$scope.getAllProject=function()
{
  
         $scope.allhomePageProjects=[];
         $scope.homePageProjects=[];
          var get_all_projects = firebase.database().ref('projects');
          get_all_projects.once("value", function(projects) {
             var today=$filter('date')(new Date(),'dd/MM/yy');
            if($scope.searchFilters.timeDuration=='all')
                {
                  for(var key1 in projects.val())
                  {
                       var d=projects.val()[key1];
                      d.id=key1;
                      if(d.comments)
                        d.commnetscount=$rootScope.getObjectLength(d.comments);
                      else
                        d.commnetscount=0;

                      if(d.views)
                        d.viewscount=$rootScope.getObjectLength(d.views);
                      else
                        d.viewscount=0;

                    $scope.allhomePageProjects.push(d);
                  }
                
                }

                if($scope.searchFilters.timeDuration=='today')
                {
                  for(var key1 in projects.val())
                  {
                    if(today==$filter('date')(projects.val()[key1].publishAt,'dd/MM/yy'))
                    {
                       var d=projects.val()[key1];
                      d.id=key1;
                      if(d.comments)
                        d.commnetscount=$rootScope.getObjectLength(d.comments);
                      else
                        d.commnetscount=0;

                      if(d.views)
                        d.viewscount=$rootScope.getObjectLength(d.views);
                      else
                        d.viewscount=0;

                      $scope.allhomePageProjects.push(d);
                    }
                  }
                
                }
                if($scope.searchFilters.timeDuration=='this_week')
                {
                 
                  var today_d=$filter('date')(new Date(),'dd');
                  var today_m=$filter('date')(new Date(),'MM');
                  var today_y=$filter('date')(new Date(),'yy');

                  var n = new Date().getDay();

                  for(var key1 in projects.val())
                  {
                   
                  if(today_y==$filter('date')(projects.val()[key1].publishAt,'yy'))
                    if(today_m==$filter('date')(projects.val()[key1].publishAt,'MM'))
                      if((today_d-$filter('date')(projects.val()[key1].publishAt,'dd'))<=n)
                      {
                        var d=projects.val()[key1];
                      d.id=key1;
                      if(d.comments)
                        d.commnetscount=$rootScope.getObjectLength(d.comments);
                      else
                        d.commnetscount=0;

                      if(d.views)
                        d.viewscount=$rootScope.getObjectLength(d.views);
                      else
                        d.viewscount=0;

                        $scope.allhomePageProjects.push(d);
                      }
                  }
                }
                if($scope.searchFilters.timeDuration=='customer_range' && $scope.searchFilters.customer_rangeto && $scope.searchFilters.customer_rangefrom)
                {
                  var temp_to=$scope.searchFilters.customer_rangeto.split('-');
                  var temp_from=$scope.searchFilters.customer_rangefrom.split('-');
                  for(var key1 in projects.val())
                  {
                    
                    var to=CompareDate(temp_to[1]+'-'+temp_to[0]+'-'+temp_to[2],($filter('date')(projects.val()[key1].publishAt,'MM-dd-yyyy')));
                    var from=CompareDate(temp_from[1]+'-'+temp_from[0]+'-'+temp_from[2],($filter('date')(projects.val()[key1].publishAt,'MM-dd-yyyy')));
                  
                    if(to && !from)
                    {
                       var d=projects.val()[key1];
                      d.id=key1;
                      if(d.comments)
                        d.commnetscount=$rootScope.getObjectLength(d.comments);
                      else
                        d.commnetscount=0;

                      if(d.views)
                        d.viewscount=$rootScope.getObjectLength(d.views);
                      else
                        d.viewscount=0;

                      $scope.allhomePageProjects.push(d);
                    }
                    }
                  
                }
                
                 /* if($scope.searchFilters)
                  {
                    if($scope.searchFilters.sort=='latest')
                    {
                      $scope.allhomePageProjects=$filter('orderBy')($scope.allhomePageProjects,'-publishAt');
                    }
                     if($scope.searchFilters.sort=='all')
                    {
                      $scope.allhomePageProjects=$filter('orderBy')($scope.allhomePageProjects,'-publishAt');
                    }
                    if($scope.searchFilters.sort=='mostcommented')
                    {
                      $scope.allhomePageProjects=$filter('orderBy')($scope.allhomePageProjects,'-commnetscount');
                    }
                    if($scope.searchFilters.sort=='mostviewed')
                    {
                      $scope.allhomePageProjects=$filter('orderBy')($scope.allhomePageProjects,'-viewscount');
                    }
                  }*/
                
                
                if(!$scope.$$phase) {
                    $scope.$apply();
                    }
               
              
             setTimeout(function(){
                if($scope.searchFilters.sort=='latest')
                    {
                     $scope.allhomePageProjects=$filter('orderBy')($scope.allhomePageProjects,'-publishAt');
                    }
      
                    if($scope.searchFilters.sort=='mostcommented')
                    {
                      $scope.allhomePageProjects=$filter('orderBy')($scope.allhomePageProjects,'-commnetscount');
                    }
                    if($scope.searchFilters.sort=='mostviewed')
                    {
                      $scope.allhomePageProjects=$filter('orderBy')($scope.allhomePageProjects,'-viewscount');
                    }
                      for(var i=0;i<$scope.allhomePageProjects.length && i<5 ;i++)
                        $scope.homePageProjects.push($scope.allhomePageProjects[i]);
                      
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');
                        if($scope.allhomePageProjects.length>=3)
                        $scope.moreDataCanBeLoaded=true;


              $ionicLoading.hide();
              $scope.allhomePageProjectsIsFetched=true;
            },2000); 
          });
        
        
         
}
/*if(window.localStorage.getItem('info'))
 {
 
   if($rootScope.userdata)
   {
    //$scope.getCategoryProject();  //call this function to get project by user interested topics 
    $scope.getAllProject();
   }
   else
   {
        var ref = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid);
        ref.on("value", function(snapshot) {
         $rootScope.userdata=snapshot.val();
        
             //$scope.getCategoryProject();  //call this function to get project by user interested topics 
$scope.getAllProject();

          }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
          
        $ionicLoading.hide();
        });

      var get_notification = firebase.database().ref('/notification/'+JSON.parse(window.localStorage.getItem('info')).uid);
      get_notification.orderByChild('date').on("value", function(notifications) {
       
        $rootScope.notifications=notifications.val();
        $rootScope.unReadNotificationsCount=0;
        $rootScope.unReadNotificationsCount_tab=0;
        for(key in $rootScope.notifications)
        {
          console.log($rootScope.notifications[key].delete);
          if($rootScope.notifications[key].status=='unread' && $rootScope.notifications[key].delete!='true')
            $rootScope.unReadNotificationsCount=$rootScope.unReadNotificationsCount+1;
          if($rootScope.notifications[key].status=='unread' && $rootScope.notifications[key].type!='chat' && $rootScope.notifications[key].delete!='true')
            $rootScope.unReadNotificationsCount_tab=$rootScope.unReadNotificationsCount_tab+1;
        }
        if(!$scope.$$phase) {
          $scope.$apply();
          }
      });
    }
}*/
if($scope.searchFilters.categories!=null && $scope.searchFilters.categories.length>0)
{
  console.log("getFilteredCategoryProject");
   $scope.getAllProject();
   var handleinterval =setInterval(function(){
     if($scope.allhomePageProjectsIsFetched)
     {
      clearInterval(handleinterval);
      $scope.getFilteredCategoryProject();
     }
    
   },1000);
}
else{

  console.log("all project");
  $scope.getAllProject();
}


$scope.like=function(projectid,projectOwner)
    {
          var ref = firebase.database().ref("/projects/"+projectid+"/likes");
            ref.orderByChild('userid').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).once("value", function(snapshot) {
         if(snapshot.val()==null)
         {
          ref.push({userid:JSON.parse(window.localStorage.getItem('info')).uid});
            var ref1 = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/projectlikes");
            ref1.orderByChild('projectid').equalTo(projectid).once("value", function(snapshot) {
             if(snapshot.val()==null)
             {
              ref1.push({projectid:projectid});
              var ref2 = firebase.database().ref("/users/"+projectOwner+"/project_likers");
              ref2.push({projectid:projectid,userid:JSON.parse(window.localStorage.getItem('info')).uid});
             

             }

             });
            
         }

         });
    }
 $scope.unlike=function(projectid,projectOwner)
    {
          var ref = firebase.database().ref("/projects/"+projectid+"/likes");
            ref.orderByChild('userid').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).once("value", function(snapshot) {
         if(snapshot.val())
         {
            for(key in snapshot.val())
            {
              var ref1 = firebase.database().ref("/projects/"+projectid+"/likes/"+key);
              ref1.remove();
              var ref2 = firebase.database().ref("/users/"+JSON.parse(window.localStorage.getItem('info')).uid+"/projectlikes");
                ref2.orderByChild('projectid').equalTo(projectid).once("value", function(snapshot1) {
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
                ref3.orderByChild('projectid').equalTo(projectid).once("value", function(snapshot1) {
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
];
  function CompareDate(dateOne,dateTwo) {
   
       if (new Date(dateOne).getTime() > new Date(dateTwo).getTime()) {
            return true;
        }else {
           return false;
        }
    }