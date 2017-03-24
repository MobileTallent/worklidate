'use strict';
module.exports = [
    '$scope','$stateParams','$location','$rootScope','Analytics', function($scope,$stateParams,$location,$rootScope,Analytics) {
$rootScope.checkLogin();
if($stateParams.type)
{
	$scope.searchType=$stateParams.type;
	$scope.searchoption=$stateParams.type;
}
if($stateParams.id)
{
$scope.id=$stateParams.id
}
else
$scope.id=0;

$scope.show_filters=function(type)
{

	if(type=='Project' || type=='Job')
	$location.path('/app/search/'+type);
	else
	$location.path('/app/searchresult/'+type+'/');

}
$scope.show_filters_2=function(id)
{
	var finish=0;
	
	$rootScope.categories.forEach(function(entry,index){
		if(id==entry.parent_id)
		finish=1;
		

		if($rootScope.categories.length==(index+1))
		{
			
			if(finish==0)
				$location.path('/app/searchresult/'+$stateParams.type+'/'+id);
				else
				$location.path('/app/search/'+$scope.searchType+'/'+id);
			}
		
	});

	
}
$scope.mainSearch=function(search,searchoption)
{
	
	$location.path('/app/searchresult/'+searchoption+'/'+search);
}
Analytics.trackPage('Search');
}
];