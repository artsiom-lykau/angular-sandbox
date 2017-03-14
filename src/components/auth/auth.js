/**
 * Created by lykovartem on 3/9/2017.
 */

angular.module('myApp')
    .controller('AuthController', ['$scope', 'sharedService', 'authenticationService', '$state',
        function ($scope, sharedService, authenticationService, $state) {
            $scope.showLogIn = false;
            $scope.logInErr = false;
            $scope.userExist = false;

            $scope.auth = function (username, password, rememberMe) {
                if (!$scope.showLogIn) {
                    authenticationService.register(username, password,
                        function (res) {
                            if (res.status == 200) {
                                $scope.showLogIn = true;
                            }
                        },
                        function (res) {
                            if (res.status == 409) {
                                $scope.userExist = true
                            }
                            if (res.status == 404) {
                                $scope.logInErr = true
                            }
                        })
                }
                else {
                    authenticationService.logIn(username, password, rememberMe,
                        function (res) {
                            if (res.status == 200) {
                                sharedService.currentUser = res.data;
                                $state.go('list');
                            }
                        },
                        function (res) {
                            if (res.status == 404) {
                                $scope.logInErr = true;
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