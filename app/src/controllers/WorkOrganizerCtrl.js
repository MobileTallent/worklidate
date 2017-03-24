'use strict';
module.exports = [
    '$scope','$rootScope','Firebase','Analytics', function($scope,$rootScope,Firebase,Analytics) {
    $rootScope.checkLogin();
    if($rootScope.clearBrowserHistory==true)
    {

    window.history.go(-window.history.length);
    $rootScope.clearBrowserHistory=false;
  }
   $scope.tabs = [{
            title: 'Talent',
            url: 'templates/views/talent.tpl.html'
        },
        {
            title: 'Employer',
            url: 'templates/views/employer.tpl.html'
        }
    ];
    
    $scope.currentTab = 'templates/views/talent.tpl.html';

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    }
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }
    var jobsRef = firebase.database().ref('/jobs/');
    jobsRef.orderByChild('userid').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).on("value", function(jobs) {
        $scope.EmployerOpenJobs=[];
        $scope.EmployerClosedJobs=[];
        $scope.EmployerWorkingJobs=[];
        
        for(var key in jobs.val()){
                var d=jobs.val()[key];
                d.id=key;
                   // $scope.userOpenJobs.push(d);
                
                if(jobs.val()[key].status=="end")
                    $scope.EmployerClosedJobs.push(d);
                if(jobs.val()[key].status=="working")
                    $scope.EmployerWorkingJobs.push(d);
                if(jobs.val()[key].status=="open")
                    $scope.EmployerOpenJobs.push(d);
               
            }
            
             if(!$scope.$$phase) {
                    $scope.$apply();
                    }
    });

    var proposalRef = firebase.database().ref('/jobproposals/');
    proposalRef.orderByChild('talent_id').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).on("value", function(proposals) {
        $scope.userOpenProposals=[];
        for(var key in proposals.val()){
                var d=proposals.val()[key];
                d.id=key;

                if(proposals.val()[key].status=="open")
                    $scope.userOpenProposals.push(d);

            }
             if(!$scope.$$phase) {
                    $scope.$apply();
                    }
    });
    var proposalRef = firebase.database().ref('/contracts/');
    proposalRef.orderByChild('talent_id').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).on("value", function(proposals) {
        $scope.userWorkingContracts=[];
        $scope.userCompletedContracts=[];
         $scope.userEndContracts=[];
        for(var key in proposals.val()){
                var d=proposals.val()[key];
                d.id=key;
console.log(proposals.val()[key].status);
                if(proposals.val()[key].status=="open")
                    $scope.userWorkingContracts.push(d);
                 if(proposals.val()[key].status=="completed")
                    $scope.userCompletedContracts.push(d);
                 if(proposals.val()[key].status=="end")
                    $scope.userEndContracts.push(d);

            }
             if(!$scope.$$phase) {
                    $scope.$apply();
                    }
    });
    var proposalRef = firebase.database().ref('/contracts/');
    proposalRef.orderByChild('employer_id').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).on("value", function(proposals) {
        $scope.employerWorkingContracts=[];
         $scope.employerCompletedContracts=[];
         $scope.employerEndContracts=[];
         
        
        for(var key in proposals.val()){
                var d=proposals.val()[key];
                d.id=key;
console.log(proposals.val()[key].status);
                if(proposals.val()[key].status=="open")
                    $scope.employerWorkingContracts.push(d);
                if(proposals.val()[key].status=="completed")
                    $scope.employerCompletedContracts.push(d);
                if(proposals.val()[key].status=="end")
                    $scope.employerEndContracts.push(d);
               

            }
             if(!$scope.$$phase) {
                    $scope.$apply();
                    }
    });
    var proposalRef = firebase.database().ref('/jobproposalsClosed/');
    proposalRef.orderByChild('talent_id').equalTo(JSON.parse(window.localStorage.getItem('info')).uid).on("value", function(proposals) {
        
        $scope.userClosedproposals=[];
        for(var key in proposals.val()){
                var d=proposals.val()[key];
                d.id=key;
                if(proposals.val()[key].status=="close")
                    $scope.userClosedproposals.push(d);

            }
            if(!$scope.$$phase) {
                    $scope.$apply();
                    }
    });
    Analytics.trackPage('Work_Organizer');
}
];