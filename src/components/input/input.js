/**
 * Created by lykovartem on 2/20/2017.
 */

angular.module('myApp')
    .controller('InputController', ['sharedService', '$scope', 'dataService', 'localStorageService',
        function (sharedService, $scope, dataService, localStorageService) {
            $scope.showTasksByState = sharedService.showTasksByState;

            $scope.addNewTask = function (newTask) {
                newTask.createTime = Date.now();
                if (newTask.name && newTask.taskState) {
                    localStorageService.setNewItem(newTask, dataService.addNewTask);
                    $scope.showTasksByState($scope.selectedState);
                    $scope.newTask = {};
                }
            };

            $scope.$watch(() => sharedService.states,
                function () {
                    if (!sharedService.states) {
                        localStorageService.getLocalStorageItems(dataService.getUser, dataService.getTasksAndStates)
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
