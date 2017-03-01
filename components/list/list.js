/**
 * Created by lykovartem on 2/16/2017.
 */

angular.module('myApp')
    .controller('ListController', ['sharedService', 'getDataService', '$scope', '$http',
        function (sharedService, getDataService, $scope, $http) {
            let showTasksByState = sharedService.showTasksByState;
            $scope.showTasksByState = sharedService.showTasksByState;

            $scope.$watch(() => sharedService.tasksToShow,
                function () {
                    $scope.tasksToShow = sharedService.tasksToShow;
                });

            getDataService()
                .then(results => {
                    sharedService.todos = results[0].data;
                    sharedService.states = results[1].data;
                    $scope.states = results[1].data;
                    /*$timeout*/
                    showTasksByState('all');
                });

            $scope.getStateName = function (task) {
                return task.taskState
                    .replace(/([A-Z])/, ' $1')
                    .replace(/^./, str => str.toUpperCase());
            };

            $scope.getOrderProp = function () {
                $scope.orderProp = sharedService.orderProp;
                $scope.descOrder = sharedService.descOrder;
                if ($scope.orderProp == 'status') {
                    return function statesOrder(task) {
                        switch (task.taskState) {
                            case 'todo':
                                return 0;
                            case 'inProgress':
                                return 1;
                            case 'testing':
                                return 2;
                            case 'done':
                                return 3;
                        }
                    }
                }
                return $scope.orderProp
            };

            $scope.editTask = function (task) {
                task.showEditMenu = !task.showEditMenu;

                if (task.showEditMenu == false) {
                    $http.put(`/api/update-task/${task._id}`, task);
                    showTasksByState($scope.selectedState);
                }
            };

            $scope.deleteTask = function (task) {
                sharedService.todos.splice(sharedService.todos.indexOf(task), 1);
                showTasksByState(sharedService.selectedState);
                $http.delete(`/api/delete-task/${task._id}`, task);
            };

        }])
    .directive('listTemplate', function () {
        return {
            restrict: 'E',
            templateUrl: './components/list/list-template.html',
            controller: 'ListController',
            controllerAs: 'listCtrl'
        }
    });
