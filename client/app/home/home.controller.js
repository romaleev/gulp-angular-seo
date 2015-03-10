'use strict';

angular.module('romaleev')
	.config(function(/*$routeProvider*/$stateProvider) {
	    $stateProvider
	        .state('home', {
				title: 'Home',
	            url: '/',
				templateUrl: 'app/home/home.html',
				controller: 'HomeCtrl'
	        });
		/*$routeProvider
			.when('/', {
				templateUrl: 'app/home/home.html',
				controller: 'HomeCtrl',
				title: 'Home'
			});*/
	})
	.controller('HomeCtrl', function($scope, homeService) {
		$scope.contacts = homeService.contacts;
	});