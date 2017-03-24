'use strict';

/**
 * @ngdoc overview
 * @name Worklidate
 * @description
 * # Initializes main application and routing
 *
 * Main module of the application.
 */

// Example to require lodash
// This is resolved and bundled by browserify
//
// var _ = require( 'lodash' );

var starter=angular.module( 'Worklidate', [
  'ionic',
  'ngCordova',
  'ngResource',
  'angular-google-analytics','credit-cards','ion-floating-menu','firebase','simditor','angular-timezone-selector','ngFileUpload','ui.select','ngSanitize','ngAutocomplete','ngTagsInput','as.sortable','720kb.socialshare','pascalprecht.translate','ngDialog','ngDraggable','720kb.datepicker','once','angular-input-stars',"ion.rangeslider","textAngular", 'ionic-material','angular-clipboard'
] )
.run( [
  '$ionicPlatform',
   '$rootScope',
   'Firebase',
   '$location',
   '$window',
   '$ionicSideMenuDelegate',
   '$state',
  function($ionicPlatform,$rootScope,Firebase,$location,$window,$ionicSideMenuDelegate,$state)
  {

  $ionicPlatform.ready(function() {


 $rootScope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };


if(window.localStorage.getItem('lang'))
 {
  
   $rootScope.currentLang=window.localStorage.getItem('lang');
 }
 else
 { 
  
    $rootScope.currentLang='en';
 }
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
     // cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
 
  $rootScope.getDateFromTimestamp=function(timestamp)
  {
    var myDate = new Date(timestamp*1000);
    var formatedTime=myDate.toJSON();
   return formatedTime;
  }
   $rootScope.getTimestampFromDate=function(date)
  {
    
    var myDate = new Date(date);
    return myDate;
  }
  $rootScope.getURI_Encode=function(url)
  {
   return encodeURI(url);
  }
  $rootScope.gotoprojectDetails=function(id)
  {
    $location.path('/app/project_details/'+id);
  }
  $rootScope.gotogroupDetails=function(id)
{
  $location.path('/app/groupdetails/'+id);
}
$rootScope.gotouserDetails=function(id)
{
  if(id==$rootScope.loggedUserId)
    $location.path('/app/profile');
   else 
    $location.path('/app/profileview/'+id);
}
$rootScope.calculateRating=function(ratingsData)
{
  var i=0;
  var t=0;

  if(ratingsData)
  {
    var len=$rootScope.getObjectLength(ratingsData);
    for(var key in ratingsData)
    {
      t=t+1;
      if(ratingsData[key].avgrating)
        i=i+ratingsData[key].avgrating;
      if(t==len){
              return i;
             
          }
      
    }
  }
  else{
    return 0;
  }
}
  setTimeout(function(){
    var ref = firebase.database().ref("/search");
    ref.on("value", function(snapshot) {
        $rootScope.data_for_search=snapshot.val();
        $rootScope.data_for_search_user_array=[];
        $rootScope.data_for_search_groups_array=[];
        $rootScope.data_for_search_projects_array=[];
        if($rootScope.data_for_search)
        if($rootScope.data_for_search.users)
        for(var key in $rootScope.data_for_search.users)
        {
            $rootScope.data_for_search_user_array.push($rootScope.data_for_search.users[key])
        }

        if($rootScope.data_for_search)
        if($rootScope.data_for_search.groups)
        for(var key in $rootScope.data_for_search.groups)
        {
            $rootScope.data_for_search_groups_array.push($rootScope.data_for_search.groups[key])
        }
        
        if($rootScope.data_for_search)
        if($rootScope.data_for_search.projects)
        for(var key in $rootScope.data_for_search.projects)
        {
            $rootScope.data_for_search_projects_array.push($rootScope.data_for_search.projects[key])
        }
       
    });
    
  },1000);
  $rootScope.deleteProject=function(project)
  {
  if(project)
{ 
var deleteAt=new Date();
var new_data=JSON.parse(angular.toJson(deleteAt));
 var confirm=$window.confirm("Really want to delete it?");
  if(confirm){     
  var fredRef = firebase.database().ref('/projects/'+project);
    fredRef.once("value",function(project_snap){
    var dataP=project_snap.val();
    if(project_snap.val())
    {
    var catTemp=project_snap.val().categories;
    
      for(var kcatid in catTemp)
      {
         var myRootRef_a = firebase.database().ref('/categoryprojects/'+catTemp[kcatid].id).orderByChild("project_id").equalTo(project).once("value", function(catprojects) {

            for(var key1 in catprojects.val()){
              var url='/categoryprojects/'+catprojects.key+'/'+key1;
              
              if(url && catprojects.key && key1)
              {
                var myRootRef_a1 = firebase.database().ref(url);
                myRootRef_a1.remove();
              }
            }
            
            
         });
      }
      fredRef.remove(function(error) {
      if (error) {
        console.log('Synchronization failed');
      } else {
        if(window.localStorage.getItem('info'))
        {
       var myRootRef_timeline = firebase.database().ref('/users/'+JSON.parse(window.localStorage.getItem('info')).uid+'/timeline');
                var collectionRef_timeline = myRootRef_timeline.push({publishAt:new_data,title:'Project deleted',subTitle:dataP.projectTitle,description:dataP.description,type:"delete_project",reference:project,statusline:""});

       var fredRef = firebase.database().ref('/search/projects/').orderByChild('project_id').equalTo(project);
               fredRef.once("value",function(project_snap){
             
                if(project_snap.val())
                {
                  for(var key in project_snap.val())
                  {
                  
                    var fredRef = firebase.database().ref('/search/projects/'+key);
                    fredRef.remove();
                  }
                }
               });

             }
      }
    });
    }
    });
    
    }
    }
  }

$rootScope.getStars = function(rating) {
    // Get the value
    var val = parseFloat(rating);
    // Turn value into number/100
    var size = val/5*100;
    return size + '%';
  }
  $rootScope.getObjectLength=function(obj)
  {
  if(obj==null)
  return 0;
  else
   return Object.keys(obj).length;
  }
   $rootScope.convertToDate=function(dateString)
  {
    return new Date(dateString);
  }
   $rootScope.getUTCdate=function(dateString)
  {
    return new Date(dateString+' UTC');
  }
  $rootScope.getTypeOfTransation=function(transaction)
  {
    
    if(transaction.employer_id==$rootScope.loggedUserId)
    {
      if(transaction.moneyof==transaction.employer_id)
      {
          return "Credited";
      }
      if(transaction.moneyof==transaction.talent_id)
      {
          return "Debited";
      }
    }
    if(transaction.talent_id==$rootScope.loggedUserId)
    {
      if(transaction.moneyof==transaction.employer_id)
      {
        return "Debited";
      }
      if(transaction.moneyof==transaction.talent_id)
      {
        return "Credited";
      }
    }

  }
  });

  // add possible global event handlers here

} ] )

.config( [
  '$httpProvider',
  '$stateProvider',
  '$urlRouterProvider',
  '$translateProvider',
  'AnalyticsProvider',

  function( $httpProvider,$stateProvider,$urlRouterProvider,$translateProvider,AnalyticsProvider)
  {
    AnalyticsProvider.setAccount(app_config.analyticsKey);
 $translateProvider.translations('en', lang_en);
 $translateProvider.translations('zh', lang_ch); 
 if(window.localStorage.getItem('lang'))
 {
   $translateProvider.preferredLanguage(window.localStorage.getItem('lang'));
 
 }
 else
 { 
    $translateProvider.preferredLanguage('en');
  
 }

    // register $http interceptors, if any. e.g.
    // $httpProvider.interceptors.push('interceptor-name');

    // Application routing
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })
      .state('app.login', {
      cache:false,
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/views/login.html',
          controller: 'LoginCtrl'
        }
      }
    }).state('app.forgotpassword', {
      url: '/forgotpassword',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/forgotpassword.html',
          controller: 'ForgotpasswordCtrl'
        }
      }
    }).state('app.signup', {
      url: '/signup',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/signup.html',
          controller: 'SignupCtrl'
        }
      }
    }).state('app.chat', {
      url: '/chat/:id',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/chat.html',
          controller: 'ChatCtrl'
        }
      }
    }).state('app.mainpage', {
      url: '/mainpage',
      cache:true,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/mainpage.html',
          controller: 'MainpageCtrl'
        }
      }
    })
    .state('app.carddetails', {
      url: '/carddetails',
      cache:true,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/carddetails.html',
          controller: 'CardDetailsCtrl'
        }
      }
    })
    .state('app.groupdiscussion', {
      url: '/groupdiscussion/:id',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/group_discussion.html',
          controller: 'GroupDiscussionCtrl'
        }
      }
    }).state('app.groupinvite', {
      url: '/groupinvite/:id',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/group_invite.html',
          controller: 'InviteGroupCtrl'
        }
      }
    }).state('app.profile', {
      cache:false,
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/views/profile.html',
          controller: 'ProfileCtrl'
        }
      }
    }).state('app.profileview', {
      url: '/profileview/:id',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/profile_view.html',
          controller: 'ProfileViewCtrl'
        }
      }
    }).state('app.profile_about', {
      url: '/profile_about',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/about.tpl.html',
          controller: 'ProfileCtrl'
        }
      }
    })
    .state('app.profile_comments', {
      url: '/profile_comments',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/comments.tpl.html',
          controller: 'ProfileCtrl'
        }
      }
    })
    .state('app.profile_jobs', {
      url: '/profile_jobs',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/jobs.tpl.html',
          controller: 'ProfileCtrl'
        }
      }
    })
    .state('app.jobinvitation', {
      url: '/jobinvitation/:id',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/inviteforjob.html',
          controller: 'InviteForJob'
        }
      }
    })
    .state('app.profile_project', {
      url: '/profile_project',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/project.tpl.html',
          controller: 'ProfileCtrl'
        }
      }
    })
    .state('app.profile_timeline', {
      url: '/profile_timeline',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/timeLine.tpl.html',
          controller: 'ProfileCtrl'
        }
      }
    }).state('app.project_details', {
      url: '/project_details/:id',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/project_details.html',
          controller: 'ProjectDtailsCtrl'
        }
      }
    }).state('app.addproject', {
      url: '/addproject',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/add_project.html',
          controller: 'AddProjectCtrl'
        }
      }
    }).state('app.addmoreprojectinfo', {
    cache:false,
      url: '/addmoreprojectinfo',
      views: {
        'menuContent': {
          templateUrl: 'templates/views/add_more_info.html',
          controller: 'AddProjectCtrl'
        }
      }
    }).state('app.jobpost', {
      url: '/jobpost',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/jobpost.html',
          controller: 'JobpostCtrl'
        }
      }
    }).state('app.endcontract', {
      url: '/endcontract/:id',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/endcontract.html',
          controller: 'endcontraCtrl'
        }
      }
    }).state('app.contractfeedback', {
      url: '/contractfeedback/:id',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/endcontract.html',
          controller: 'contractFeedbackCtrl'
        }
      }
    }).state('app.proposallist', {
      url: '/proposallist/:id',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/proposallist.html',
          controller: 'ProposallistCtrl'
        }
      }
    }).state('app.applytojob', {
      url: '/applytojob/:id',
       cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/applytojob.html',
          controller: 'ApplytojobCtrl'
        }
      }
    }).state('app.jobdetails', {
      url: '/jobdetails/:id',
       cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/jobdetails.html',
          controller: 'JobDetailsCtrl'
        }
      }
    }).state('app.jobdetailsemployer', {
      url: '/job/details/:id',
       cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/jobdetails_employer.html',
          controller: 'JobDetailsEmployerCtrl'
        }
      }
    }).state('app.contract_details_talent_view', {
       cache:false,
      url: '/contract/details/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/views/contract_details_talent_view.html',
          controller: 'ContractdetailsTalentViewCtrl'
        }
      }
    }).state('app.contract_details_employee_view', {
      url: '/contract/details/emp/:id',
       cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/contract_details_employee_view.html',
          controller: 'ContractdetailsEmployeeViewCtrl'
        }
      }
    }).state('app.job_contract_list', {
      url: '/job/contract/:id',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/job_contract_list.html',
          controller: 'JobContractListCtrl'
        }
      }
    }).state('app.proposaldetails', {
      url: '/proposaldetails/:id',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/proposaldetails.html',
          controller: 'ProposaldetailsCtrl'
        }
      }
    })
    .state('app.milestonespayment', {
      url: '/milestonespayment/:proposalid/:type',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/milestonepayment.html',
          controller: 'MilestonesPaymentCtrl'
        }
      }
    })
    .state('app.proposaldetailstalent', {
      url: '/proposal/details/:id',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/proposaldetails_talent_view.html',
          controller: 'ProposaldetailsTalentViewCtrl'
        }
      }
    }).state('app.submitmilestone', {
      url: '/submitmilestone/:contractId/:id',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/submitmilestone.html',
          controller: 'SubmitmilestoneCtrl'
        }
      }
    })
    .state('app.submitmilestoneapprove', {
      url: '/submitmilestone/approve/:contractId/:id',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/submitmilestoneapprove.html',
          controller: 'SubmitmilestoneApproveCtrl'
        }
      }
    })
    .state('app.assignmilestone', {
      url: '/assignmilestone/:contractId',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/assign_milestone.html',
          controller: 'AssignMilestoneCtrl'
        }
      }
    })
    .state('app.workorganizer', {
      url: '/workorganizer',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/work_organizer.html',
          controller: 'WorkOrganizerCtrl'
        }
      }
    }).state('app.myfinance', {
      url: '/myfinance',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/myfinance.html',
          controller: 'MyFinanceCtrl'
        }
      }
    }).state('app.mymoney', {
      url: '/mymoney',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/mymoney.html',
          controller: 'MyMoneyCtrl',
          resolve: {
            taskObj:['$ionicPopup','$rootScope', function($ionicPopup,$rootScope){
             console.log("resolve");
              if(!$rootScope.loginVarify)
              {
                return $ionicPopup.show({
              template: '<input type="password" class="placeholder-grey pad0" placeholder="Enter Password"  ng-model="$root.tempwifidata.wifi">',
              title: 'Enter your password',
              subTitle: 'Please enter your worklidate account password to continue.',
              scope: $rootScope,
              buttons: [
                { text: 'Cancel' },
                {
                  text: '<b>Confirm</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                    if (!$rootScope.tempwifidata.wifi) {
                      //don't allow the user to close unless he enters wifi password
                      e.preventDefault();
                    } else {
                      return $rootScope.tempwifidata.wifi;
                    }
                  }
                }
              ]
            }).then(function(res) {
               return firebase.auth().signInWithEmailAndPassword(JSON.parse(window.localStorage.getItem('info')).email, res).then(function(authData) {
               
                if(authData.emailVerified) {
                  $rootScope.loginVarify=true;
                  return true;

                }
                else{
                alert("Login failed. Please try again.");
                  e.preventDefault();
              }
              }, function(error) {
                alert("Login failed. Please try again.");
                  e.preventDefault();
              });
              
            });
              }
              else
              {
                return true;
              }
              

            
            }]
          }
        }
      }
    }).state('app.paymentmethods', {
      url: '/paymentmethods',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/paymentmethods.html',
          controller: 'PaymentMethodsCtrl'
        }
      }
    }).state('app.inovices', {
      url: '/inovices',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/invoices.html',
          controller: 'InvoicesCtrl'
        }
      }
    }).state('app.statements', {
      url: '/statements',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/statements.html',
          controller: 'StatementCtrl'
        }
      }
    }).state('app.transactions', {
      url: '/transactions',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/transactions.html',
          controller: 'TransactionsCtrl'
        }
      }
    })
    .state('app.withdrawmoney', {
      url: '/withdrawmoney',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/withdraw.html',
          controller: 'WithdrawMoneyCtrl'
        }
      }
    }).state('app.feedback', {
      url: '/feedback',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/feedback.html',
          controller: 'FeedbackCtrl'
        }
      }
    }).state('app.faq', {
      url: '/faq',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/faq.html',
          controller: 'FaqCtrl'
        }
      }
    }).state('app.feedbackid', {
      url: '/feedback/:id/:type',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/feedbackDetails.html',
          controller: 'FeedbackDetailsCtrl'
        }
      }
    }).state('app.inbox', {
      url: '/inbox',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/inbox.html',
          controller: 'InboxCtrl'
        }
      }
    })
    .state('app.group', {
      url: '/group',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/group.html',
          controller: 'GroupCtrl'
        }
      }
    }) .state('app.sortby', {
      url: '/sortby',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/sortby.html',
          controller: 'SortByCtrl'
        }
      }
    }) .state('app.search', {
      url: '/search',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/search.html',
          controller: 'SearchCtrl'
        }
      }
    }).state('app.searchtype', {
      url: '/search/:type',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/search.html',
          controller: 'SearchCtrl'
        }
      }
    }).state('app.searchtypeid', {
      url: '/search/:type/:id',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/search.html',
          controller: 'SearchCtrl'
        }
      }
    }).state('app.searchresult', {
      url: '/searchresult/:type/:id',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/search_result.html',
          controller: 'SearchResultCtrl'
        }
      }
    }) .state('app.searchresultdetails', {
      url: '/searchresultdetails',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/search_result_details.html',
          controller: 'SearchResultDetailsCtrl'
        }
      }
    }).state('app.setting', {
      cache:false,
      url: '/setting',
      views: {
        'menuContent': {
          templateUrl: 'templates/views/setting.html',
          controller: 'SettingCtrl'
        }
      }
    }).state('app.editprofile', {
      url: '/editprofile',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/edit_profile.html',
          controller: 'EditProfileCtrl'
        }
      }
    }).state('app.groupdetails', {
      url: '/groupdetails/:id',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/group_details.html',
          controller: 'GroupDetailstCtrl'
        }
      }
    }).state('app.justLoadCtrl1', {
      url: '/justLoadCtrl1/',

      views: {
        'menuContent': {
          templateUrl: 'templates/views/employer.tpl.html',
          controller: 'justLoadCtrl'
        }
      }
    }).state('app.justLoadCtrl2', {
      url: '/justLoadCtrl2/',
      views: {
        'menuContent': {
          templateUrl: 'templates/views/talent.tpl.html',
          controller: 'justLoadCtrl'
        }
      }
    }).state('app.paypalpayment', {
      url: '/paypalpayment/:id',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/paypalpayment.html',
          controller: 'paypalpaymentCtrl'
        }
      }
    }).state('app.paypalpaymentfail', {
      url: '/paypalpaymentfail',
      cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/views/paypalpaymentfail.html',
          controller: 'paypalpaymentfailCtrl'
        }
      }
    });

    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/mainpage');
  }
] ).directive('select',function(){ //same as "ngSelect"
    return {
        restrict: 'E',
        scope: false,
        link: function (scope, ele) {
            ele.on('touchmove touchstart',function(e){
                e.stopPropagation();
            })
        }
    }
}).filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
  }]).filter('getUser', ['$sce','$rootScope','$firebaseObject', function($sce,$rootScope,$firebaseObject) {
    return function(userid) {
     var ref = firebase.database().ref('/users/'+userid);
      return $firebaseObject(ref);
 
       
    };
  }]).filter('yesNo', function () {
  return function (boolean) {
    return boolean ? 'Yes' : 'No';
  }
})
  .filter('getGroup', ['$sce','$rootScope','$firebaseObject', function($sce,$rootScope,$firebaseObject) {
    return function(groupid) {
    
     var ref = firebase.database().ref('/groups/'+groupid);

      return $firebaseObject(ref);
 
       
    };
  }]).filter('getProject', ['$sce','$rootScope','$firebaseObject', function($sce,$rootScope,$firebaseObject) {
    return function(id) {
    
     var ref = firebase.database().ref('/projects/'+id);

      return $firebaseObject(ref);
 
       
    };
  }]).filter('getJob', ['$sce','$rootScope','$firebaseObject', function($sce,$rootScope,$firebaseObject) {
    return function(id) {
     var ref = firebase.database().ref('/jobs/'+id);

      return $firebaseObject(ref);
 
       
    };
  }])
  .filter('checkInvites', ['$sce','$rootScope','$firebaseObject', function($sce,$rootScope,$firebaseObject) {
    return function(userid,groupid) {
    var fredRef = firebase.database().ref('/groups/'+groupid+'/invites');
      return $firebaseObject(fredRef.orderByChild("userid").equalTo(userid));
 };
  }]).filter('checkPresent', ['$sce','$rootScope','$firebaseObject', function($sce,$rootScope,$firebaseObject) {
    return function(collection,userid) {

    for(var key in collection)
    {
        if(collection[key].userid==userid)
        return true;
    }
 };
  }]).filter('positive', function() {
        return function(input) {
            if (!input) {
                return 0;
            }

            return Math.abs(input);
        };
    }).filter('getLastElementOfObject', ['$sce','$rootScope','$firebaseObject', function($sce,$rootScope,$firebaseObject) {
    return function(collection,userid) {
     return Object.keys(collection)[Object.keys(collection).length-1];
 };
  }]).filter('checkSettingPresent', ['$sce','$rootScope','$firebaseObject', function($sce,$rootScope,$firebaseObject) {
    return function(collection,catid) {
   
    for(var key in collection)
    {
        if(collection[key].catid==catid)
        return true;
    }
 };
  }]).filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
          
      });

      return output;
   };
}).filter('objfilter', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];
      for(var key in collection)
      {
      if(collection[key].issue.indexOf(keyname))
        output.push(collection[key]);
      }

      return output;
   };
}).filter('objectToArray', function() {
   return function(collection) {
      var output = [], 
          keys = [];
      for(var key in collection)
      {
        var d=collection[key];
        d.id=key;
        output.push(d);
      }

      return output;
   };
}).filter('reverse', function() {
  return function(items) {
   
    if(items)
    return items.slice().reverse();

  };
}).filter('matchesAll', function() {
    return function(items, relevant, property) {
        if(!(relevant && relevant.length)){
            return items; // No categories to compare with, return everything
        }

        property = property || 'categories'; // By default look at categories

        return items.filter(function(item) {
          
            var itemProps=[];
            item[property].forEach(function(entry){
              itemProps.push(entry.name);
            });
            return relevant.every(function(relevantCategory){
              
                return itemProps.indexOf(relevantCategory) !== -1;
            });
        });
    };
})
.directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star">' +
            '<i class="fa fa-star" ng-if="star.filled==true"></i>' +
            '<i class="fa fa-star-o" ng-if="star.filled==false"></i>' +
            '</li>' +
            '</ul>',
        
        scope: {
            ratingValue: '=',
            max: '='
        },
        link: function (scope, elem, attrs) {
            scope.stars = [];
            for (var i = 0; i < scope.max; i++) {
                scope.stars.push({
                    filled: i < scope.ratingValue
                });
            }
        }
    }
})
.directive('loading', function () {
      return {
        restrict: 'E',
        replace:true,
        template: '<div class="loading"><img src="images/ajax-loader.gif" class="imgload" /></div>',
        link: function (scope, element, attr) {
              scope.$watch('loading', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
        }
      }
  }).directive('onlyDigits', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
            var digits = val.replace(/[^0-9]/g, '');

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return parseInt(digits,10);
          }
          return undefined;
        }            
        ctrl.$parsers.push(inputValue);
      }
    };
}).directive('readMore', function() {
  return {
    restrict: 'A',
    transclude: true,
    replace: true,
    template: '<p></p>',
    scope: {
      moreText: '@',
      lessText: '@',
      words: '@',
      ellipsis: '@',
      char: '@',
      limit: '@',
      content: '@',
      text: '@'

    },
    link: function(scope, elem, attr, ctrl, transclude) {
      var moreText = angular.isUndefined(scope.moreText) ? ' <a class="read-more">Read More...</a>' : ' <a class="read-more">' + scope.moreText + '</a>',
        lessText = angular.isUndefined(scope.lessText) ? ' <a class="read-less">Less ^</a>' : ' <a class="read-less">' + scope.lessText + '</a>',
        ellipsis = angular.isUndefined(scope.ellipsis) ? '' : scope.ellipsis,
        limit = angular.isUndefined(scope.limit) ? 150 : scope.limit;

      attr.$observe('content', function(str) {
        
        readmore(scope.text);
      });

      transclude(scope.$parent, function(clone, scope) {
        readmore(clone.text().trim());
      });

      function readmore(text) {
        
        var text = text,
          orig = text,
          regex = /\s+/gi,
          charCount = text.length,
          wordCount = text.trim().replace(regex, ' ').split(' ').length,
          countBy = 'char',
          count = charCount,
          foundWords = [],
          markup = text,
          more = '';

        if (!angular.isUndefined(attr.words)) {
          countBy = 'words';
          count = wordCount;
        }

        if (countBy === 'words') { // Count words

          foundWords = text.split(/\s+/);

          if (foundWords.length > limit) {
            text = foundWords.slice(0, limit).join(' ') + ellipsis;
            more = foundWords.slice(limit, count).join(' ');
            markup = text + moreText + '<span class="more-text">' + more + lessText + '</span>';
          }

        } else { // Count characters

          if (count > limit) {
            text = orig.slice(0, limit) + ellipsis;
            more = orig.slice(limit, count);
            markup = text + moreText + '<span class="more-text">' + more + lessText + '</span>';
          }

        }

        elem.append(markup);
        elem.find('.read-more').on('click', function() {
          $(this).hide();
          elem.find('.more-text').addClass('show').slideDown();
        });
        elem.find('.read-less').on('click', function() {
          elem.find('.read-more').show();
          elem.find('.more-text').hide().removeClass('show');
        });

      }
    }
  };
})

// Angular module controllers
//
.controller( 'MainpageCtrl',     require( './controllers/MainpageCtrl'))
.controller( 'AppCtrl',     require( './controllers/appCtrl'))
.controller( 'ApplytojobCtrl',     require( './controllers/ApplytojobCtrl'))
.controller( 'AssignMilestoneCtrl',     require( './controllers/assignMilestone'))
.controller( 'ChatCtrl',     require( './controllers/chatCtrl'))
.controller( 'ContractdetailsEmployeeViewCtrl',     require( './controllers/ContractdetailsEmployeeViewCtrl'))
.controller( 'ContractdetailsTalentViewCtrl',     require( './controllers/ContractdetailsTalentViewCtrl'))
.controller( 'contractFeedbackCtrl',     require( './controllers/contractFeedbackCtrl'))
.controller( 'CardDetailsCtrl',     require( './controllers/carddetails'))
.controller( 'EditProfileCtrl',     require( './controllers/EditProfileCtrl'))
.controller( 'EditProjectCtrl',     require( './controllers/EditProjectCtrl'))
.controller( 'endcontraCtrl',     require( './controllers/endcontraCtrl'))
.controller( 'FaqCtrl',     require( './controllers/faqCtrl'))
.controller( 'FeedbackCtrl',     require( './controllers/FeedbackCtrl'))
.controller( 'FeedbackDetailsCtrl',     require( './controllers/FeedbackDetailsCtrl'))
.controller( 'ForgotpasswordCtrl',     require( './controllers/ForgotpasswordCtrl'))
.controller( 'GroupCtrl',     require( './controllers/GroupCtrl'))
.controller( 'GroupDetailstCtrl',     require( './controllers/GroupDetailstCtrl'))
.controller( 'GroupDiscussionCtrl',     require( './controllers/groupDiscussionCtrl'))
.controller( 'groupInviteCtrl',     require( './controllers/groupInviteCtrl'))
.controller( 'InboxCtrl',     require( './controllers/InboxCtrl'))
.controller( 'AddProjectCtrl',     require( './controllers/insertProjectCtrl'))
.controller( 'InviteForJob',     require( './controllers/inviteforjob'))
.controller( 'InvoicesCtrl',     require( './controllers/invoices'))
.controller( 'JobContractListCtrl',     require( './controllers/JobContractListCtrl'))
.controller( 'JobDetailsCtrl',     require( './controllers/jobdetailsctrl'))
.controller( 'JobDetailsEmployerCtrl',     require( './controllers/jobdetailsEmployerctrl'))
.controller( 'JobpostCtrl',     require( './controllers/jobpost'))
.controller( 'LoginCtrl',     require( './controllers/loginCtrl'))
.controller( 'MilestonesPaymentCtrl',     require( './controllers/MilestonesPaymentCtrl'))
.controller( 'MyFinanceCtrl',     require( './controllers/MyFinanceCtrl'))
.controller( 'MyMoneyCtrl',     require( './controllers/MyMoneyCtrl'))
.controller( 'PaymentMethodsCtrl',     require( './controllers/paymentmethod'))
.controller( 'paypalpaymentCtrl',     require( './controllers/paypalpaymentCtrl'))
.controller( 'paypalpaymentfailCtrl',     require( './controllers/paypalpaymentfailCtrl'))
.controller( 'ProfileCtrl',     require( './controllers/ProfileCtrl'))
.controller( 'ProfileViewCtrl',     require( './controllers/ProfileViewCtrl'))
.controller( 'ProjectDtailsCtrl',     require( './controllers/ProjectDtailsCtrl'))
.controller( 'ProposaldetailsCtrl',     require( './controllers/proposaldetailsCtrl'))
.controller( 'ProposaldetailsTalentViewCtrl',     require( './controllers/ProposaldetailsTalentViewCtrl'))
.controller( 'ProposallistCtrl',     require( './controllers/ProposallistCtrl'))
.controller( 'SearchCtrl',     require( './controllers/SearchCtrl'))
.controller( 'SearchResultCtrl',     require( './controllers/SearchResultCtrl'))
.controller( 'SearchResultDetailsCtrl',     require( './controllers/SearchResultDetailsCtrl'))
.controller( 'SettingCtrl',     require( './controllers/SettingCtrl'))
.controller( 'SignupCtrl',     require( './controllers/SignupCtrl'))
.controller( 'SortByCtrl',     require( './controllers/SortByCtrl'))
.controller( 'StatementCtrl',     require( './controllers/statement'))
.controller( 'SubmitmilestoneApproveCtrl',     require( './controllers/SubmitmilestoneApproveCtrl'))
.controller( 'SubmitmilestoneCtrl',     require( './controllers/SubmitmilestoneCtrl'))
.controller( 'TransactionsCtrl',     require( './controllers/transactions'))
.controller( 'WithdrawMoneyCtrl',     require( './controllers/WithdrawMoneyCtrl'))
.controller( 'WorkOrganizerCtrl',     require( './controllers/WorkOrganizerCtrl'))
.controller( 'justLoadCtrl',     require( './controllers/justLoadCtrl'))
.factory("Auth", function($firebaseAuth,$rootScope) {
  var usersRef = firebase.database().ref("/users");
  return $firebaseAuth(usersRef);
})
;
