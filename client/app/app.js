'use strict';

angular.module('romaleev', ['ngRoute', 'ngSanitize'])
	.config(function($locationProvider, $routeProvider) {
		$locationProvider.html5Mode(true);
		$routeProvider.otherwise({
			redirectTo: '/'
		});
	})
	.controller('NavbarCtrl', function ($scope, $location) {
		$scope.isActive = function (viewLocation) { 
			return viewLocation === $location.path();
		};
	});