/**
 * Created by lykovartem on 26.02.2017.
 */

angular.module('myApp')
    .controller('filterController', ['$scope', 'sharedService', '$uibModal',
        function ($scope, sharedService,$uibModal) {
            $scope.showTasksByState = sharedService.showTasksByState;

            /*$scope.open = function (size, parentSelector) {
                let modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    template: require('../input/input-template.html'),
                    controller: 'InputController',
                    // appendTo: parentElem,
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });
            };*/

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
            };
        }])
    .directive('filterTemplate', function () {
        return {
            restrict: 'E',
            controller: 'filterController',
            template: require('./filter-template.html')
        }
    });
