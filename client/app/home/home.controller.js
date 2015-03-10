'use strict';

angular.module('romaleev')
	.config(function($stateProvider) {
	    $stateProvider
	        .state('home', {
				title: 'Home',
	            url: '/',
				templateUrl: 'app/home/home.html',
				controller: 'HomeCtrl'
	        });
	})
	.controller('HomeCtrl', function($scope, homeService) {
		$scope.contacts = homeService.contacts;
	});