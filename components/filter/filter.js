/**
 * Created by lykovartem on 26.02.2017.
 */

angular.module('myApp')
    .controller('filterController', ['$scope', 'sharedService',
        function ($scope, sharedService) {
            $scope.showTasksByState = sharedService.showTasksByState;

            $scope.$watch(function () {
                return sharedService.states
            }, function () {
                if (sharedService.states) {
                    $scope.filterOptions = sharedService.states;
                    $scope.filterOptions.unshift({title: 'All', state: 'all'})
                }
            });

            $scope.setOrderProp = function (orderProp, descOrder) {
                sharedService.orderProp = orderProp;
                sharedService.descOrder = descOrder;
            }

        }])
    .directive('filterTemplate', function () {
        return {
            restrict: 'E',
            scope: false,
            controller: 'filterController',
            templateUrl: './components/filter/filter-template.html'
        }
    });