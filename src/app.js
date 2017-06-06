/**
 * Created by lykovartem on 2/16/2017.
 */

angular.module('myApp', [
    'ui.router',
    'ngAnimate',
    'ui.bootstrap',
    'ngCookies',
    'angular-md5'
])
    .factory('sharedService', ['$filter',
        function ($filter) {
            let sharedService = {
                showTasksByState: function (selectedState = 'all') {

                    let tasks = JSON.parse(localStorage.getItem('tasks'));
                    let states = JSON.parse(localStorage.getItem('states'));

                    let tasksByState = $filter('filter')(tasks,
                        item => {
                            return selectedState == 'all' ? item : item.taskState == selectedState
                        });

                    let selectedTitle = states.find(item => {
                        return item.state == selectedState
                    });

                    sharedService.tasksToShow = {
                        header: selectedTitle ? selectedTitle.title : "All",
                        data: tasksByState
                    };

                    sharedService.selectedState = selectedState;
                },
                isLoggedIn: false
            };
            return sharedService;
        }])
    .factory('dataService', ['$http', '$q',
        function ($http, $q) {
            return {
                getTasksAndStates: function () {
                    return $q.all([
                        $http.get(`./api/all-tasks`),
                        $http.get('./data/states.json')
                    ]);
                },
                getUser: function () {
                    return $http.get('./api/user-id')
                },
                addNewTask: function (task) {
                    return $http.post('/api/create-task', task);
                },
                editTask: function (task) {
                    return $http.put(`/api/update-task/${task._id}`, task);
                },
                deleteTask: function (task) {
                    return $http.delete(`/api/delete-task/${task._id}`, task);
                }
            }
        }])
    .factory('localStorageService', [function () {
        return {
            getLocalStorageItems: function (getUser, getTasks) {
                return getUser()
                    .then(res => {
                        let currentUser = res.data;
                        if (currentUser != localStorage.getItem('user')) {
                            return getTasks()
                                .then(res => {
                                    let tasks = res[0].data;
                                    let states = res[1].data;
                                    localStorage.setItem('tasks', JSON.stringify(tasks));
                                    localStorage.setItem('states', JSON.stringify(states));
                                    localStorage.setItem('user', currentUser);
                                    return new Promise(function (resolve) {
                                        resolve([
                                            JSON.parse(localStorage.getItem('tasks')),
                                            JSON.parse(localStorage.getItem('states')),
                                        ])
                                    });
                                });
                        }
                        return new Promise(function (resolve) {
                            resolve([
                                JSON.parse(localStorage.getItem('tasks')),
                                JSON.parse(localStorage.getItem('states')),
                            ])
                        })
                    });
            },
            setNewItem: function (item, sendToBD) {
                sendToBD(item);
                let tasks = JSON.parse(localStorage.getItem('tasks'));
                tasks.push(item);
                localStorage.setItem('tasks', JSON.stringify(tasks));
            },
            updateItem: function (item, sendToBD) {
                sendToBD(item);
                let tasks = JSON.parse(localStorage.getItem('tasks'));
                let task = tasks.findIndex(it => it._id == item._id);
                tasks[task] = item;
                localStorage.setItem('tasks', JSON.stringify(tasks));
            },
            removeItem: function (item, sendToBD) {
                sendToBD(item);
                let tasks = JSON.parse(localStorage.getItem('tasks'));
                let task = tasks.findIndex(it => it._id == item._id);
                tasks.splice(task, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
        }
    }])
    .factory('authenticationService', ['$http', 'md5',
        function ($http, md5) {
            return {
                logIn: function (username, password, cb, errCb) {
                    $http.post('/api/log-in', {
                        username,
                        password: md5.createHash(password)
                    })
                        .then(res => {
                            if (cb) cb(res)

                        })
                        .catch(res => {
                            if (errCb) errCb(res)
                        })
                },
                register: function (username, password, cb, errCb) {
                    $http.post('/api/register', {
                        username,
                        password: md5.createHash(password)
                    })
                        .then(res => {
                            if (cb) cb(res)
                        })
                        .catch(res => {
                            if (errCb) errCb(res)
                        })
                },
                logOut: function (cb) {
                    $http.get('/api/log-out')
                        .then(res => {
                            if (cb) cb(res)
                        })
                }
            }
        }])
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            let listState = {
                name: 'list',
                url: '/',
                template: require('./components/list/list-template.html'),
                controller: 'ListController'
            };

            let inputState = {
                name: 'list.addNew',
                url: 'addnew',
                sticky: true,
                views: {
                    'addNew': {
                        template: require('./components/input/input-template.html'),
                        controller: 'InputController'
                    }
                }
            };

            let authState = {
                name: 'auth',
                url: '/auth',
                template: require('./components/auth/auth-template.html'),
                controller: 'AuthController'
            };

            $stateProvider.state(listState);
            $stateProvider.state(inputState);
            $stateProvider.state(authState);

            $urlRouterProvider.otherwise('/');
        }])
    .run(['$state', 'sharedService',
        function ($state, sharedService) {
            if (!sharedService.isLoggedIn) $state.go('auth')
        }]);
