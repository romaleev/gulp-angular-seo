'use strict';

angular.module('romaleev')
	.config(function($routeProvider) {
		$routeProvider
			.when('/directory', {
				templateUrl: "app/directory/directory.html",
				controller: "DirectoryCtrl",
				title: 'Directory'
			});
	})
	.controller('DirectoryCtrl', function($scope, directories) {
		directories.get().then(function(response) {
			$scope.directories = response;
		});
	});