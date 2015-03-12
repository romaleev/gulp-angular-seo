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
	.run(function($rootScope, $state, $stateParams) {
	    $rootScope.$state = $state;
    	$rootScope.$stateParams = $stateParams;
	    console.log('ready');
	});