/**
 * Created by lykovartem on 2/20/2017.
 */

angular.module('myApp')
    .controller('InputController', ['sharedService', '$scope', '$http', 'getDataService',
        function (sharedService, $scope, $http, getDataService) {
            $scope.showTasksByState = sharedService.showTasksByState;

            $scope.addNewTask = function (newTask) {
                newTask.createTime = Date.now();
                sharedService.todos.push(newTask);
                $scope.showTasksByState($scope.selectedState);
                $scope.newTask = {};

                $http.post('/api/create-task', newTask)
            };

            $scope.$watch(() => sharedService.states,
                function () {
                    if (!sharedService.states) {
                        getDataService()
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
