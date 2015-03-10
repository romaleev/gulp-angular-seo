'use strict';

angular.module('romaleev', ['ui.router', 'ngSanitize'])
	.config(function($locationProvider, $compileProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
		$locationProvider.html5Mode(true).hashPrefix('!');
		$urlRouterProvider.otherwise('/');
		//$urlMatcherFactoryProvider.strictMode(false);
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|tel|mailto|skype):/);
	})
	.controller('NavbarCtrl', function ($scope, homeService) {
		$scope.tab_title = homeService.tab_title;
		$scope.header_title = homeService.header_title;
	})
	.run(function($rootScope, $state, $stateParams) {
	    $rootScope.$state = $state;
    	$rootScope.$stateParams = $stateParams;
	    console.log('ready');
	});