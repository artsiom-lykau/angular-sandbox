/**
 * Created by lykovartem on 2/20/2017.
 */

angular.module('myApp')
    .controller('InputController', ['sharedService', '$scope', 'dataService',
        function (sharedService, $scope, dataService) {
            $scope.showTasksByState = sharedService.showTasksByState;

            $scope.addNewTask = function (newTask) {
                newTask.createTime = Date.now();
                if (newTask.name && newTask.taskState) {
                    sharedService.todos.push(newTask);
                    $scope.showTasksByState($scope.selectedState);
                    dataService.addNewTask(newTask);
                    $scope.newTask = {};
                }
            };

            $scope.$watch(() => sharedService.states,
                function () {
                    if (!sharedService.states) {
                        dataService.getTasksAndStates()
                            .then(res => {
                                sharedService.states = res[1].data;
                            })
                    }
                    $scope.states = sharedService.states;
                });

        }])
    .directive('inputTemplate', function () {
        return {
            restrict: 'E',
            templateUrl: './input-template.html',
            controller: 'InputController'
        }
    });
