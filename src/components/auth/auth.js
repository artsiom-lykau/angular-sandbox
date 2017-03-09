/**
 * Created by lykovartem on 3/9/2017.
 */

angular.module('myApp')
    .controller('AuthController', ['$scope', 'sharedService',
        function ($scope, sharedService) {
            $scope.register = function (username, password) {

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