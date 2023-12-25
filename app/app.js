// app/app.js
var app = angular.module('myApp', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/components/whiteboard/whiteboard.html',
            controller: 'WhiteboardController'
        })
    $urlRouterProvider.otherwise('/');
});

app.controller('MainController', function ($scope) {
    $scope.message = 'Hello, AngularJS!';
});






