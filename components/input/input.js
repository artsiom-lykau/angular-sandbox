/**
 * Created by lykovartem on 2/20/2017.
 */

angular.module('myApp')
    .controller('InputController', ['sharedService', '$scope', '$http',
        function (sharedService, $scope, $http) {
            $scope.showTasksByState = sharedService.showTasksByState;

            $scope.addNewTask = function (newTask) {
                newTask.id = sharedService.todos.length;
                newTask.createTime = Date.now();
                sharedService.todos.push(newTask);
                $scope.showTasksByState($scope.selectedState);
                $scope.newTask = {};

                //  HERE HAVE TO PUSH TODOS TO SERVER

                $http.post('/api/create-task', newTask)
                    .then((data) => {
                            console.log(data)
                        }
                    )
            };

            $scope.$watch(function () {
                return sharedService.states
            }, function () {
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