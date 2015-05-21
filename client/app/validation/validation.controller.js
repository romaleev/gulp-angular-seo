'use strict';

angular.module('romaleev')
    .config(function($stateProvider) {
        $stateProvider
            .state('validation', {
                title: 'Validation',
                url: '/validation',
                templateUrl: 'app/validation/validation.html',
                controller: 'ValidationCtrl'
            });
    })
    .controller('ValidationCtrl', function($scope, $window) {
        $scope.alert = alert.bind($window);
        $scope.log = console.log.bind(console);
        $scope.gender = ['Mr', 'Ms'];
        /*if ($scope.json) $http.jsonp($scope.json + '?callback=JSON_CALLBACK').then(function(response) {
            //$http.get($scope.url).success(function(response) {
            console.log(response);
            //$scope.data = response.data;
        }).catch(function(error) {
            throw error;
        });*/
    });
