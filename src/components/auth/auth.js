/**
 * Created by lykovartem on 3/9/2017.
 */

angular.module('myApp')
    .controller('AuthController', ['$scope', 'sharedService', 'authenticationService', '$state',
        function ($scope, sharedService, authenticationService, $state) {
            $scope.showLogIn = false;

            $scope.auth = function (username, password) {
                if (!$scope.showLogIn) {
                    authenticationService.register(username, password,
                        function (res) {
                            console.log(res);
                            if (res.status == 200) {
                                $scope.showLogIn = true;
                            }
                        })
                }
                else {
                    authenticationService.logIn(username, password,
                        function (res) {
                            console.log(res);
                            if (res.status == 200) {
                                sharedService.currentUser = res.data;
                                $state.go('list');
                            }
                        })
                }
            }
        }])
    .directive('authTemplate', function () {
        return {
            restrict: 'E',
            templateUrl: './components/auth/auth-template.html',
            controller: 'AuthController',
            controllerAs: 'authCtrl'
        }
    });