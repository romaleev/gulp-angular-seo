'use strict';

angular.module('romaleev')
	.filter('fieldFilter', function() {
		return function(input) {
			return input ? Object.keys(input) : [];
		};
	});