'use strict';

angular.module('romaleev')
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: "app/home/home.html"
			});
	})
	.controller('HomeCtrl', function($scope, data) {
		$scope.contacts = data.contacts;
	});