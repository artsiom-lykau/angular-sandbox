!function(t){function e(o){if(s[o])return s[o].exports;var n=s[o]={i:o,l:!1,exports:{}};return t[o].call(n.exports,n,n.exports,e),n.l=!0,n.exports}var s={};return e.m=t,e.c=s,e.i=function(t){return t},e.d=function(t,s,o){e.o(t,s)||Object.defineProperty(t,s,{configurable:!1,enumerable:!0,get:o})},e.n=function(t){var s=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(s,"a",s),s},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=7)}([function(t,e,s){"use strict";angular.module("myApp",["ui.router"]).factory("sharedService",["$filter",function(t){var e={showTasksByState:function(){var s=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"all",o=t("filter")(e.todos,function(t){return"all"==s?t:t.taskState==s}),n=e.states.find(function(t){return t.state==s});e.tasksToShow={header:n?n.title:"All",data:o},e.selectedState=s}};return e}]).factory("getDataService",["$http","$q",function(t,e){return function(){return e.all([t.get("/api/all-tasks"),t.get("./data/states.json")])}}]).config(function(t,e){var o={name:"list",url:"/",template:s(6),controller:"ListController"},n={name:"list.addNew",url:"addnew",sticky:!0,views:{addNew:{template:s(5),controller:"InputController"}}};t.state(o),t.state(n),e.otherwise("/")})},function(t,e,s){"use strict";angular.module("myApp").controller("filterController",["$scope","sharedService",function(t,e){t.showTasksByState=e.showTasksByState,t.$watch(function(){return e.states},function(){e.states&&(t.filterOptions=e.states.slice(),t.filterOptions.unshift({title:"All",state:"all"}))}),t.setOrderProp=function(){e.orderProp=t.orderProp,e.descOrder=t.descOrder}}]).directive("filterTemplate",function(){return{restrict:"E",controller:"filterController",template:s(4)}})},function(t,e,s){"use strict";angular.module("myApp").controller("InputController",["sharedService","$scope","$http","getDataService",function(t,e,s,o){e.showTasksByState=t.showTasksByState,e.addNewTask=function(o){o.createTime=Date.now(),t.todos.push(o),e.showTasksByState(e.selectedState),e.newTask={},s.post("/api/create-task",o)},e.$watch(function(){return t.states},function(){t.states||o().then(function(e){t.states=e[1].data}),e.states=t.states})}]).directive("inputTemplate",function(){return{restrict:"E",templateUrl:"./input-template.html",controller:"InputController"}})},function(t,e,s){"use strict";angular.module("myApp").controller("ListController",["sharedService","getDataService","$scope","$http",function(t,e,s,o){var n=t.showTasksByState;s.showTasksByState=t.showTasksByState,s.$watch(function(){return t.tasksToShow},function(){s.tasksToShow=t.tasksToShow}),e().then(function(e){t.todos=e[0].data,t.states=e[1].data,s.states=e[1].data,n("all")}),s.getStateName=function(t){return t.taskState.replace(/([A-Z])/," $1").replace(/^./,function(t){return t.toUpperCase()})},s.getOrderProp=function(){return s.orderProp=t.orderProp,s.descOrder=t.descOrder,"status"==s.orderProp?function(t){switch(t.taskState){case"todo":return 0;case"inProgress":return 1;case"testing":return 2;case"done":return 3}}:s.orderProp},s.editTask=function(t){t.showEditMenu=!t.showEditMenu,0==t.showEditMenu&&(o.put("/api/update-task/"+t._id,t),n(s.selectedState))},s.deleteTask=function(e){t.todos.splice(t.todos.indexOf(e),1),n(t.selectedState),o.delete("/api/delete-task/"+e._id,e)}}]).directive("listTemplate",function(){return{restrict:"E",templateUrl:"./components/list/list-template.html",controller:"ListController",controllerAs:"listCtrl"}})},function(t,e){t.exports='<div class=filter> <form> <a ui-sref=list.addNew>add new task</a> <label for=filter>show task by state:</label> <select id=filter ng-model=selectedState ng-change=showTasksByState(selectedState) ng-options="option.state as option.title for option in filterOptions"> </select> <label for=order-by>select prop to sort:</label> <select id=order-by ng-change=setOrderProp() ng-model=orderProp> <option value=name>Task name</option> <option value=hours>Hours</option> <option value=createTime>Creation time</option> <option value=status>Status</option> </select> <label for=desc-order>check to desc. order:</label> <input id=desc-order type=checkbox ng-model=descOrder ng-change=setOrderProp()> </form> </div>'},function(t,e){t.exports='<div class=popup-background ui-sref=list></div> <div class=input-popup> <div ui-sref=list class=input-popup__close-btn>X</div> <form class=input-form> <input placeholder=name type=text name=name ng-model=newTask.name> <input placeholder=description type=text name=description ng-model=newTask.description> <input placeholder=hours type=number name=hours ng-model=newTask.hours> <label for=newTask>select task state:</label> <select id=newTask ng-model=newTask.taskState ng-options="state.state as state.title for state in states"> </select> <button ng-click=addNewTask(newTask)>add new task</button> </form> </div>'},function(t,e){t.exports="<filter-template></filter-template> <div ui-view=addNew></div> <div class=list-container> <h1 class=state-heading>{{tasksToShow.header}}</h1> <ul ng-repeat=\"task in tasksToShow.data | orderBy: getOrderProp() : descOrder track by $index\" ng-init=\"task.showEditMenu = false\"> <li class=task ng-class=\"{'todo-clr': task.taskState == 'todo',\r\n                       'in-progress-clr': task.taskState == 'inProgress',\r\n                       'testing-clr': task.taskState == 'testing',\r\n                       'done-clr': task.taskState == 'done'}\"> <h3 ng-hide=task.showEditMenu>{{task.name}}</h3> <input type=text ng-model=task.name ng-show=task.showEditMenu> <h4 ng-hide=task.showEditMenu>{{getStateName(task)}}</h4> <label for=moveTo ng-show=task.showEditMenu>move to state:</label> <select id=moveTo ng-model=task.taskState ng-options=\"state.state as state.title for state in states\" ng-show=task.showEditMenu> </select> <div ng-hide=task.showEditMenu class=task__description>description: {{task.description}}</div> <textarea id=\"\" cols=21 rows=5 ng-model=task.description ng-show=task.showEditMenu></textarea> <p ng-hide=task.showEditMenu>hours: {{task.hours}}</p> <input type=number ng-model=task.hours ng-show=task.showEditMenu> <button class=edit-btn ng-click=editTask(task)> {{task.showEditMenu ? 'Submit' : 'Edit'}} </button> <button class=delete-btn ng-click=deleteTask(task)>X</button> </li> </ul> </div>"},function(t,e,s){"use strict";s(0),s(1),s(2),s(3)}]);