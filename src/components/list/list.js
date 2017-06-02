/**
 * Created by lykovartem on 2/16/2017.
 */

angular.module('myApp')
    .controller('ListController', ['sharedService', 'dataService', '$scope', 'authenticationService', '$state',
        function (sharedService, dataService, $scope, authenticationService, $state) {
            let showTasksByState = sharedService.showTasksByState;
            $scope.showTasksByState = sharedService.showTasksByState;
            $scope.currentUser = sharedService.currentUser;
            $scope.logOut = authenticationService.logOut.bind(null,
                function (res) {
                    $state.go('auth')
                });

            $scope.$watch(() => sharedService.tasksToShow,
                function () {
                    $scope.tasksToShow = sharedService.tasksToShow;
                });

            dataService.getTasksAndStates()
                .then(results => {
                    sharedService.todos = results[0].data;
                    sharedService.states = results[1].data;
                    $scope.states = results[1].data;
                    showTasksByState('all');
                });

            $scope.getStateName = function (task) {
                return task.taskState
                    .replace(/([A-Z])/, ' $1')
                    .replace(/^./, str => str.toUpperCase());
            };

            $scope.showOrderProp = function (task) {
                $scope.orderProp = sharedService.orderProp;
                switch ($scope.orderProp) {
                    case 'taskState':
                        return $scope.getStateName(task);
                    case 'hours':
                        return `Hours: ${task.hours}`;
                    case 'name':
                        return '';
                    case 'createTime':
                        let date = new Date(task.createTime);
                        return date.toLocaleString();
                }
            };

            $scope.getOrderProp = function () {
                $scope.orderProp = sharedService.orderProp;
                $scope.descOrder = sharedService.descOrder;
                if ($scope.orderProp == 'taskState') {
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
                if (!task.showEditMenu && task.name && task.taskState) {
                    dataService.editTask(task);
                    showTasksByState($scope.selectedState);
                }
            };

            $scope.deleteTask = function (task, e) {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                sharedService.todos.splice(sharedService.todos.indexOf(task), 1);
                showTasksByState(sharedService.selectedState);
                dataService.deleteTask(task);
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
