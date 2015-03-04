'use strict';

angular.module('romaleev')
	.config(function($routeProvider) {
		$routeProvider.when('/directory/:name', {
			templateUrl: "app/details/details.html",
			controller: "DetailsCtrl",
			title: 'Details'
		});
	})
	.controller('DetailsCtrl', function($scope, $routeParams, $location, peopleService) {
		peopleService.get(decodeURI($routeParams.name)).then(function(response) {
			if (!response)
				return $location.path('/');

			$scope.person = {
				Name: '<span class="bold">' + response.name.first + ' ' + response.name.last + '</span>',
				About: response.about,
				Picture: '<img class="img-circle img-thumbnail" src="' + response.picture.large + '" />',
				ID: '<span class="alert alert-danger">' + response._id + '</span>',
				Email: response.email,
				Phone: response.phone,
				Address: response.address,
				Salary: '<span class="text-primary">' + response.price + ',000$</span>'
			};
			$scope.id = response._id;
			$scope.hired = peopleService.isHired(response._id);
			$scope.hire = function(id){
				return peopleService.hire(id);
			};
		});
	})
	.filter('keys', function() {
		return function(input) {
			return input ? Object.keys(input) : [];
		};
	});