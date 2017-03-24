/**
 * @Author: Geoffrey Bauduin <bauduin.geo@gmail.com>
 */

angular.module("ion.rangeslider", []);

angular.module("ion.rangeslider").directive("ionRangeSlider", ['$parse',
    function ($parse) {
        
        return {
            restrict: "E",
            scope: {
                min: "=",
                max: "=",
                type: "@",
                prefix: "@",
                maxPostfix: "@",
                prettify: "@",
                grid: "@",
                gridMargin: "@",
                postfix: "@",
                step: "@",
                hideMinMax: "@",
                hideFromTo: "@",
                from: "=",
                to: "=",
                ngModel: '=',
                disable: "=",
                onChange: "=",
                onFinish: "="
            },
            replace: true,
            link: function ($scope, $element,$attributes) {
                console.log($element);
                $element.ionRangeSlider({
                    min: $scope.min,
                    max: $scope.max,
                    type: $scope.type,
                    prefix: $scope.prefix,
                    maxPostfix: $scope.maxPostfix,
                    prettify: $scope.prettify,
                    grid: $scope.grid,
                    gridMargin: $scope.gridMargin,
                    postfix: $scope.postfix,
                    step: $scope.step,
                    hideMinMax: $scope.hideMinMax,
                    hideFromTo: $scope.hideFromTo,
                    from: $scope.from,
                    to: $scope.to,
                    disable: $scope.disable,
                    onChange: function (a) {
                       
                        $scope.onChange && $scope.onChange(a);
                    },
                    onFinish: function (a) {
                        $scope.onFinish && $scope.onFinish(a);
                        
                     }
                });
                var watchers = [];
                watchers.push($scope.$watch("min", function (value) {
                    $element.data("ionRangeSlider").update({
                        min: value
                    });
                }));
                watchers.push($scope.$watch('max', function (value) {
                    $element.data("ionRangeSlider").update({
                        max: value
                    });
                }));
                watchers.push($scope.$watch('from', function (value) {
                    $element.data("ionRangeSlider").update({
                        from: value
                    });
                }));
                watchers.push($scope.$watch('disable', function (value) {
                    $element.data("ionRangeSlider").update({
                        disable: value
                    });
                }));
            }
        }
        
    }
])
