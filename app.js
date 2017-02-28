/**
 * Created by lykovartem on 2/16/2017.
 */

angular.module('myApp', ['ui.router'])
    .factory('sharedService', ['$filter', function ($filter) {
        let sharedService = {
            showTasksByState: function (selectedState = 'all') {

                let tasksByState = $filter('filter')(sharedService.todos,
                    item => {
                        return selectedState == 'all' ? item : item.taskState == selectedState
                    });

                let selectedTitle = sharedService.states.find(item => {
                    return item.state == selectedState
                });

                sharedService.tasksToShow = {
                    header: selectedTitle ? selectedTitle.title : "All",
                    data: tasksByState
                };

                sharedService.selectedState = selectedState;
            }
        };
        return sharedService;
    }])
    .factory('getDataService', ['$http', '$q', function ($http, $q) {
        return function () {
            return $q.all([
                $http.get('/api/all-tasks'),
                $http.get('./data/states.json')
            ]);
        }
    }])
    .config(function ($stateProvider, $urlRouterProvider) {
        let listState = {
            name: 'list',
            url: '/',
            templateUrl: './components/list/list-template.html',
            controller: 'ListController',
            controllerAs: 'listCtrl'
        };

        let inputState = {
            /***** CHANGE TO STICKY STATE *****/
            name: 'addNew',
            url: '/addnew',
            templateUrl: './components/input/input-template.html',
            controller: 'InputController'
        };

        $stateProvider.state(listState);
        $stateProvider.state(inputState);

        $urlRouterProvider.otherwise('/');
    });
