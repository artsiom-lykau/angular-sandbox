/**
 * Created by lykovartem on 2/16/2017.
 */

angular.module('myApp')
    .controller('ListController', ['sharedService', 'getDataService', '$scope', '$http',
        function (sharedService, getDataService, $scope, $http) {
            let showTasksByState = sharedService.showTasksByState;
            $scope.showTasksByState = sharedService.showTasksByState;

            $scope.$watch(function () {
                return sharedService.tasksToShow
            }, function () {
                $scope.tasksToShow = sharedService.tasksToShow;
                if ($scope.tasksToShow) {
                    $scope.tasksToShow.data.forEach(item => item.showEditMenu = false);
                }
            });

            getDataService()
                .then(results => {
                    sharedService.todos = results[0].data;
                    sharedService.states = results[1].data;
                    $scope.states = results[1].data;
                    showTasksByState('all');
                });

            $scope.getOrderProp = function () {
                $scope.orderProp = sharedService.orderProp;
                $scope.descOrder = sharedService.descOrder;
                return $scope.orderProp
            };

            $scope.editTask = function (task) {
                task.showEditMenu = !task.showEditMenu;

                if (task.showEditMenu == false) {
                    delete task.showEditMenu;
                    $http.put(`/api/update-task/${task._id}`, task);
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
