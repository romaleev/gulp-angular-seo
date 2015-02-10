'use strict';

angular.module('romaleev')
	.config(function($routeProvider) {
		$routeProvider.when('/directory/:name', {
			templateUrl: "app/details/details.html",
			controller: "DetailsCtrl",
			title: 'Details'
		});
	})
	.controller('DetailsCtrl', function($scope, $routeParams, $location, directories) {
		directories.get(decodeURI($routeParams.name)).then(function(response) {
			if (!response)
				return $location.path('/');

			var person = {};
			person.Name = response.name.first + ' ' + response.name.last;
			person.About = '<span class="about">' + response.about + '</span>';
			person.Picture = '<img class="img-circle img-thumbnail" src="' + response.picture.large + '" />';
			person.ID = '<span class="alert alert-danger">' + response._id + '</span>';
			person.Email = response.email;
			person.Phone = response.phone;
			person.Address = response.address;

			$scope.person = person;
		});
	})
	.filter('keys', function() {
		return function(input) {
			return input ? Object.keys(input) : [];
		};
	});