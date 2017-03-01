/**
 * Created by lykovartem on 26.02.2017.
 */

angular.module('myApp')
    .controller('filterController', ['$scope', 'sharedService',
        function ($scope, sharedService) {
            $scope.showTasksByState = sharedService.showTasksByState;

            $scope.$watch(() => sharedService.states,
                function () {
                    if (sharedService.states) {
                        $scope.filterOptions = sharedService.states.slice();
                        $scope.filterOptions.unshift({title: 'All', state: 'all'});
                    }
                });

            $scope.setOrderProp = function () {
                sharedService.orderProp = $scope.orderProp;
                sharedService.descOrder = $scope.descOrder;
            }

        }])
    .directive('filterTemplate', function () {
        return {
            restrict: 'E',
            controller: 'filterController',
            templateUrl: './components/filter/filter-template.html'
        }
    });
