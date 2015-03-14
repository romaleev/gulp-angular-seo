'use strict';

angular.module('romaleev', ['ui.router'])
	.config(function($locationProvider, $compileProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
		$locationProvider.html5Mode(true).hashPrefix('!');
		$urlRouterProvider.otherwise('/');
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|tel|mailto|skype):/);
	})
	.controller('NavbarCtrl', function ($scope, homeConstant) {
		$scope.tab_title = homeConstant.tab_title;
		$scope.header_title = homeConstant.header_title;
	})
	.run(function($rootScope, $state, $stateParams, $location, $window) {
	    $rootScope.$state = $state;
    	$rootScope.$stateParams = $stateParams;
    	$rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
			$window.ga('send', 'pageview', $location.path());
		});
	    console.log('ready');
	});