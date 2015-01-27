'use strict';

angular.module('romaleev', ['ngRoute', 'ngSanitize'])
	.config(function($locationProvider, $routeProvider) {
		$locationProvider.html5Mode(true);
		$routeProvider.otherwise({
			redirectTo: '/'
		});
	})
	.controller('NavbarCtrl', function ($scope, $location, data) {
		$scope.isActive = function (viewLocation) {
			return viewLocation === $location.path();
		};
		$scope.tab_title = data.tab_title;
		$scope.header_title = data.header_title;
	});