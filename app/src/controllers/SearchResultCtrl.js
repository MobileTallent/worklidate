'use strict';
module.exports = [
    '$scope','$ionicModal','$stateParams','$rootScope','$location','$filter','$ionicLoading','Analytics', function($scope,$ionicModal,$stateParams,$rootScope,$location,$filter,$ionicLoading,Analytics) {
$scope.type=$stateParams.type;
$scope.id=$stateParams.id;
$scope.searched_group_result=[];
$scope.searchFilters=[];
$scope.applyMultiCat=[];
$scope.searchFilters.categories=[];
	$rootScope.checkLogin();
 $ionicModal.fromTemplateUrl('sort.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.model = modal;
  });
 $scope.viewSorts=function()
  {
  $scope.model.show();
  }

  $scope.getAllJob=function(type)
{
	$scope.mainsearchType=1;
	$scope.searchFilters.location=$scope.id;
	$scope.searched_group_result=[];
		var myRootRef_a = firebase.database().ref('/jobs/');
	            myRootRef_a.orderByChild('viewtype').equalTo('users').once("value", function(jobs) {
	            $scope.allJobs=[];
	            for(var key1 in jobs.val())
	            {
		            var d=jobs.val()[key1];
		            d.id=key1;
		            d.publishAt=$rootScope.convertToDate(jobs.val()[key1].publishAt);
		           $scope.pushJOBdata(d);
		            if(!$scope.$$phase) {
 		$scope.$apply();
 		
		}
	            
	            }
	            setTimeout(function(){
	            	if(type=='filterCategory')
	            	{
	            		$scope.applyFilters();
	            	}
	            	else
	            	{
	            		  $ionicLoading.hide();
	             		$scope.timeDuration($scope.searchFilters.timeDuration);
	            	}
	           
	            },3000);
		})
}

 $scope.applyFilters=function()
{


	if($scope.searchFilters.sort=='all' && $scope.searchFilters.timeDuration=='all' && $scope.searchFilters.jobAveragetEmployer=='' &&  $scope.searchFilters.experienceLevel=='' && $scope.searchFilters.joblength=='' &&  $scope.searchFilters.jobStatus2=='' && $scope.searchFilters.jobCurrency=='' && $scope.searchFilters.orderBy=='-publishAt' && $scope.searchFilters.jobClienthistory=='50' &&  $scope.searchFilters.jobBudget=='10000' && $scope.searchFilters.categories == [])
	{
		$rootScope.JobFilterOn=false;
		$ionicLoading.show({
               template: 'Searching...'
              });
		$scope.reset();
		$scope.getAllJob();
	}	
	else
	{	
	$ionicLoading.show({
               template: 'Searching...'
              });
 $rootScope.JobFilterOn=true;

 

 window.localStorage.setItem('job_sortdata',$scope.searchFilters.sort);
 window.localStorage.setItem('job_timeDuration',$scope.searchFilters.timeDuration);
 window.localStorage.setItem('job_jobAveragetEmployer',$scope.searchFilters.jobAveragetEmployer);
 window.localStorage.setItem('job_experienceLevel',$scope.searchFilters.experienceLevel);
 window.localStorage.setItem('job_joblength',$scope.searchFilters.joblength);
 window.localStorage.setItem('job_jobStatus2',$scope.searchFilters.jobStatus2);
 window.localStorage.setItem('job_jobCurrency',$scope.searchFilters.jobCurrency);
 window.localStorage.setItem('job_orderBy',$scope.searchFilters.orderBy);
 window.localStorage.setItem('job_jobClienthistory',$scope.searchFilters.jobClienthistory);
 window.localStorage.setItem('job_jobBudget',$scope.searchFilters.jobBudget);
 
 if($scope.searchFilters.categories)
 {
 	if($scope.searchFilters.categories.length>0)
 	{
 		if($scope.allJobs)
 		{
 		window.localStorage.setItem('job_categories',JSON.stringify($scope.searchFilters.categories));
 		 $scope.searched_group_result = [];
        var keys = [];
 		console.log($scope.allJobs);
 		 $scope.searchFilters.categories.forEach(function(searchCat,index){
          console.log("1");
            $scope.allJobs.forEach(function(entry){
              if(keys.indexOf(entry.id)<0)
                        {
              console.log("2");
              if(entry.categories)
              {
                  entry.categories.forEach(function(catPrroject){
                    console.log("3 : catPrroject.name : searchCat");
                      if(catPrroject.name==searchCat.name)
                      {
                      	$scope.searched_group_result.push(entry);
                      }
                  });
              }
          }
      });
             if(index==$scope.searchFilters.categories.length-1)
            {
              
             
              setTimeout(function(){
               $scope.timeDuration($scope.searchFilters.timeDuration);
               
            },1000); 
            }
      });  
      }
      else
      {
      	$scope.getAllJob('filterCategory');
      }    
 	}
 	else
 	{
		$scope.getAllJob();
 	}
 }
 else
 {
 	$scope.getAllJob();
 }
}
}
if($scope.type=='Job')
{
	if(window.localStorage.getItem('job_sortdata'))
	{
			console.log("job_sortdata");
			$scope.searchFilters.sort= window.localStorage.getItem('job_sortdata');
		  $scope.searchFilters.timeDuration=window.localStorage.getItem('job_timeDuration');

		  $scope.searchFilters.jobAveragetEmployer=window.localStorage.getItem('job_jobAveragetEmployer');
		  $scope.searchFilters.experienceLevel= window.localStorage.getItem('job_experienceLevel');
		  $scope.searchFilters.joblength= window.localStorage.getItem('job_joblength');
		  $scope.searchFilters.jobStatus2= window.localStorage.getItem('job_jobStatus2');
		  $scope.searchFilters.jobCurrency= window.localStorage.getItem('job_jobCurrency');
		  $scope.searchFilters.orderBy=   window.localStorage.getItem('job_orderBy');
		  $scope.searchFilters.jobClienthistory=window.localStorage.getItem('job_jobClienthistory');
		  $scope.searchFilters.jobBudget=window.localStorage.getItem('job_jobBudget');
		  if(window.localStorage.getItem('job_categories'))
		  {
		  	$scope.searchFilters.categories=JSON.parse(window.localStorage.getItem('job_categories'));
		    
		  }
		  $scope.applyFilters();
		console.log($scope.searchFilters);
		     

		}
		else
		{
			$scope.searchFilters.sort='all';
		  $scope.searchFilters.timeDuration='all';

		  $scope.searchFilters.jobAveragetEmployer='';
		  $scope.searchFilters.experienceLevel='';
		  $scope.searchFilters.joblength='';
		  $scope.searchFilters.jobStatus2='';
		  $scope.searchFilters.jobCurrency='';
		  $scope.searchFilters.orderBy='-publishAt';
		  $scope.searchFilters.jobClienthistory='50';
		  $scope.searchFilters.jobBudget='10000';
		  $scope.getAllJob();
		}
}
$scope.reset=function () {
  
$rootScope.JobFilterOn=false;
  $scope.searchFilters.sort='all';
  $scope.searchFilters.timeDuration='all';

  $scope.searchFilters.jobAveragetEmployer='';
  $scope.searchFilters.experienceLevel='';
  $scope.searchFilters.joblength='';
  $scope.searchFilters.jobStatus2='';
  $scope.searchFilters.jobCurrency='';
  $scope.searchFilters.orderBy='-publishAt';
  $scope.searchFilters.jobClienthistory='50';
  $scope.searchFilters.jobBudget='10000';
window.localStorage.removeItem('job_sortdata');
window.localStorage.removeItem('job_timeDuration');
window.localStorage.removeItem('job_jobAveragetEmployer');
 window.localStorage.removeItem('job_experienceLevel');
window.localStorage.removeItem('job_joblength');
 window.localStorage.removeItem('job_jobStatus2');
window.localStorage.removeItem('job_jobCurrency');
window.localStorage.removeItem('job_orderBy');
window.localStorage.removeItem('job_jobClienthistory');
window.localStorage.removeItem('job_jobBudget');
window.localStorage.removeItem('job_categories')
$scope.searchFilters.categories=[];
}




$ionicLoading.show({
               template: 'Searching...'
              });




if(!parseInt($scope.id) && $scope.type=='Project')
{
	$scope.mainsearchType=1;
	$scope.searchFilters.location=$scope.id;
	
		var myRootRef_a = firebase.database().ref('/projects/');
	            myRootRef_a.once("value", function(projects) {
	            $scope.allProjects=[];
	            for(var key1 in projects.val())
	            {
		            var d=projects.val()[key1];
		            d.id=key1;
		            if(projects.val()[key1].comments)
		            	d.commnetscount=$rootScope.getObjectLength(projects.val()[key1].comments);
		            else
		            	d.commnetscount=0;

		            if(projects.val()[key1].views)
		            	d.viewscount=$rootScope.getObjectLength(projects.val()[key1].views);
		            else
		            	d.viewscount=0;

		            $scope.searched_group_result.push(d);
		            $scope.allProjects.push(d);
	            
	            }
	            setTimeout(function(){
	             $ionicLoading.hide();
	              $scope.sortdata('select');
	            },3000);
		})
	
	Analytics.trackPage('Search_Project');
}
else
{

	$scope.mainsearchType=2;
	$scope.searchFilters.catId=$scope.id;
	if($stateParams.type && $scope.type=='Project')
	{
		
			var myRootRef_a = firebase.database().ref('/categoryprojects/'+$scope.searchFilters.catId);
	            myRootRef_a.once("value", function(catprojects) {
	            $scope.allProjects=[];
	            $scope.searched_group_result=[];
		            for(var key1 in catprojects.val())
		            {
		            	var myRootRef_a1 = firebase.database().ref('/projects/'+catprojects.val()[key1].project_id);
	            		myRootRef_a1.once("value", function(project) {
	            		if(project.val())
	            		{
	            				var d=project.val();
					            d.id=project.key;
					            if(project.val().comments)
					            	d.commnetscount=$rootScope.getObjectLength(project.val().comments);
					            else
					            	d.commnetscount=0;

					            if(project.val().views)
					            	d.viewscount=$rootScope.getObjectLength(project.val().views);
					            else
					            	d.viewscount=0;

					            $scope.searched_group_result.push(d);
					            $scope.allProjects.push(d);
					        }
	            		})

			            
		             
		            }
	            setTimeout(function(){
		             $ionicLoading.hide();
		             $scope.sortdata('select');
		            },3000);
	         });

		Analytics.trackPage('Search_Project');
	}

}
if($scope.type=='Group')
{
	 var myRootRef_a = firebase.database().ref('/groups/');
	            myRootRef_a.once("value", function(groups) {
	            $scope.groups=[];
	            for(var key1 in groups.val())
	            {
		            var d=groups.val()[key1];
		            d.id=key1;
		            if(groups.val()[key1].members)
		            	d.memberscount=$rootScope.getObjectLength(groups.val()[key1].members);
		            else
		            	d.memberscount=0;

		            //if(groups.val()[key1].followers)
		            //	d.followerscount=$rootScope.getObjectLength(groups.val()[key1].followers);
		           // else
		            //	d.followerscount=0;

					 $scope.searched_group_result.push(d);
		            $scope.groups.push(d);
	            
	            }
	            setTimeout(function(){
	             $ionicLoading.hide();
	            },3000);
		})
	            Analytics.trackPage('Search_Group');
}
if($scope.type=='People')
{
	 $ionicLoading.hide();
	 Analytics.trackPage('Search_People');
}

$scope.pushJOBdata=function(d)
{
	var myRootRef_a = firebase.database().ref('/users/'+d.userid);
	            myRootRef_a.once("value", function(user) {
	            	
	            	if(user.val()){
	            		d.user=user.val();
	            		d.clienthistory=$rootScope.getObjectLength(user.val().jobs);
	            		d.ratings=($rootScope.calculateRating(user.val().asEmployerfeedback)/$rootScope.getObjectLength(user.val().asEmployerfeedback));
    						$scope.searched_group_result.push(d);
    			            $scope.allJobs.push(d);
    			            if(!$scope.$$phase) {
						 		$scope.$apply();
						 		
								}

	            	}
		        });
}
$scope.jobfilters=[];
$scope.jobfilters.budget=[];
$scope.jobfilters.Clienthistory=[];
$scope.jobfilters.AveragetEmployer=[];
$scope.jobfilters.budget.from=0;
$scope.jobfilters.budget.to=100000;
$scope.jobfilters.Clienthistory.from=0;
$scope.jobfilters.Clienthistory.to=50;
$scope.jobfilters.AveragetEmployer.from=0;
$scope.jobfilters.AveragetEmployer.to=5;
$scope.jobAveragetEmployerSort=function(a)
{
	
	$scope.jobfilters.AveragetEmployer.to=a;
	$scope.jobSort();
	
}
$scope.jobClienthistorySort=function(a)
{
	$scope.jobfilters.Clienthistory=a;
	$scope.jobSort();
	
}

$scope.jobBudgetSort=function(a)
{
	$scope.jobfilters.budget=a;
	$scope.jobSort();
	
}
$scope.jobSort=function()
{
	$scope.searched_group_result=[];

	$scope.allJobs.forEach(function(entry,index){
		if(entry.budget>=$scope.jobfilters.budget.from && entry.budget<=$scope.jobfilters.budget.to && entry.clienthistory>=$scope.jobfilters.Clienthistory.from && entry.clienthistory<=$scope.jobfilters.Clienthistory.to && entry.ratings>=$scope.jobfilters.AveragetEmployer.from && entry.ratings<=$scope.jobfilters.AveragetEmployer.to)
		{
			
			$scope.searched_group_result.push(entry);
		}
	});
	 if(!$scope.$$phase) {
                    $scope.$apply();
                    }
}
$scope.groupSort=function()
{
	$scope.searched_group_result=[];
		$scope.groups.forEach(function(entry){
		if(entry.memberscount>=$scope.searchFilters.groupsmenbersFrom && entry.memberscount<=$scope.searchFilters.groupsmenbersUpto)
			$scope.searched_group_result.push(entry);
		});
}

$scope.sortdata=function(type)
{
		$ionicLoading.show({
               template: 'Searching...'
              });
	if(type=='latest' || type=='select' || type=='all')
	{

		$scope.searched_group_result=$filter('orderBy')($scope.searched_group_result,'-publishAt');
	}
	if(type=='mostcommented')
	{
		$scope.searched_group_result=$filter('orderBy')($scope.searched_group_result,'-commnetscount');
	}
	if(type=='mostviewed')
	{
		$scope.searched_group_result=$filter('orderBy')($scope.searched_group_result,'-viewscount');
	}
	
	setTimeout(function(){
		$scope.sortByJobStatus($scope.searchFilters.jobStatus2);
	             $ionicLoading.hide();
	            },100);
}
$scope.timeDuration=function(type)
{
$ionicLoading.show({
               template: 'Searching...'
              });
	if($scope.searchFilters.timeDuration=='today')
	{
		var today=$filter('date')(new Date(),'dd/MM/yy');
		
		$scope.searched_group_result=[];
		$scope.allProjects.forEach(function(entry){
		if(today==$filter('date')(entry.publishAt,'dd/MM/yy'))
			$scope.searched_group_result.push(entry);
		});
	
	}
	if($scope.searchFilters.timeDuration=='this_week')
	{
		var today=$filter('date')(new Date(),'dd/MM/yy');
		var today_d=$filter('date')(new Date(),'dd');
		var today_m=$filter('date')(new Date(),'MM');
		var today_y=$filter('date')(new Date(),'yy');

		var n = new Date().getDay();

		$scope.searched_group_result=[];
		$scope.allProjects.forEach(function(entry){
		if(today_y==$filter('date')(entry.publishAt,'yy'))
			if(today_m==$filter('date')(entry.publishAt,'MM'))
				if((today_d-$filter('date')(entry.publishAt,'dd'))<=n)
					$scope.searched_group_result.push(entry);
		});
	}
	if($scope.searchFilters.timeDuration=='customer_range' && $scope.searchFilters.customer_rangeto && $scope.searchFilters.customer_rangefrom)
	{
		
			$scope.searched_group_result=[];
			$scope.allProjects.forEach(function(entry){
			var to=CompareDate($scope.searchFilters.customer_rangeto,($filter('date')(entry.publishAt,'dd-MM-yyyy')));
			
			var from=CompareDate($scope.searchFilters.customer_rangefrom,($filter('date')(entry.publishAt,'dd-MM-yyyy')));
			
			if(to && !from)
				$scope.searched_group_result.push(entry);
			});
		
	}
	
		
	
	setTimeout(function(){
		$scope.sortdata($scope.searchFilters.sort);
	             $ionicLoading.hide();
	            },3000);
}
$scope.sortByJobStatus=function(status)
{
	$scope.searched_group_result=[];
	if(status=='')
	{
		$scope.allJobs.forEach(function(entry){
			$scope.searched_group_result.push(entry);
		});
		
	}
	else
	{
		$scope.allJobs.forEach(function(entry){
			if(entry.status==status)
			$scope.searched_group_result.push(entry);
		});
	}
	
}
}
];
