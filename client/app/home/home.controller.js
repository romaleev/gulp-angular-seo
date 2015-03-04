'use strict';

angular.module('romaleev')
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'app/home/home.html',
				controller: 'HomeCtrl',
				title: 'Home'
			});
	})
	.controller('HomeCtrl', function($scope, homeService) {
		$scope.contacts = homeService.contacts;
	});