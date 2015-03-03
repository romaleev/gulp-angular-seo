'use strict';

angular.module('romaleev')
	.directive('directory', function() {
	    return {
	        restrict: 'E',
	        scope: {
	        	fullname: '@fullname',
	        	about: '@about',
	        	thumbsrc: '@thumbsrc',
	        	price: '@price'
	        },
	        controller: function($scope){
            	$scope.encodeURI = encodeURI;
        	},
	        templateUrl: 'directives/directory/directory.html'
	    };
	});
