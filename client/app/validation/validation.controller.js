'use strict';

angular.module('romaleev')
    .config(function($stateProvider) {
        $stateProvider
            .state('validation', {
                title: 'Angular Bootstrap Validation',
                url: '/validation',
                templateUrl: 'app/validation/validation.html',
                controller: 'ValidationCtrl'
            });
    })
    .controller('ValidationCtrl', function($scope, $window) {
        $scope.alert = alert.bind($window);
        $scope.log = console.log.bind(console);
        $scope.gender = ['Mr', 'Ms'];
    });
