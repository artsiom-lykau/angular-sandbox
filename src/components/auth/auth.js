/**
 * Created by lykovartem on 3/9/2017.
 */

angular.module('myApp')
    .controller('AuthController', ['$scope', 'sharedService', 'authenticationService', '$state',
        function ($scope, sharedService, authenticationService, $state) {
            const errMsgs = {
                userExist: 'User already exist!',
                logInErr: 'Invalid username or password!'
            };

            $scope.register = function (username, password) {
                authenticationService.register(username, password,
                    function (res) {
                        if (res.status == 200) {
                            $scope.showLogIn = true;
                            $scope.registerSuccess = true;
                        }
                    },
                    function (res) {
                        if (res.status == 409) {
                            $scope.showErrMsg = true;
                            $scope.errMsg = errMsgs.userExist;
                        }
                        if (res.status == 404) {
                            $scope.showErrMsg = true;
                            $scope.errMsg = errMsgs.logInErr;
                        }
                    })
            };

            $scope.logIn = function (username, password) {
                authenticationService.logIn(username, password,
                    function (res) {
                        if (res.status == 200) {
                            sharedService.currentUser = res.data;
                            $state.go('list');
                        }
                    },
                    function (res) {
                        if (res.status == 404) {
                            $scope.showErrMsg = true;
                            $scope.errMsg = errMsgs.logInErr
                        }
                    })
            };
        }
    ])
    .directive('authTemplate', function () {
        return {
            restrict: 'E',
            templateUrl: './components/auth/auth-template.html',
            controller: 'AuthController',
            controllerAs: 'authCtrl'
        }
    });
