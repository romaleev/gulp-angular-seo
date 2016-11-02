angular.module('romaleev', ['ui.router', 'ngSanitize', 'ui.bootstrap', 'jsonFormatter'])
	.config(($uibTooltipProvider,$locationProvider, $compileProvider, $urlRouterProvider, $urlMatcherFactoryProvider)=>{
		$locationProvider.html5Mode(true).hashPrefix('!');
		$urlRouterProvider.otherwise('/');
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|tel|mailto|skype):/);
		/*$tooltipProvider.setTriggers({
		   	'show': 'hide'
		});*/
		$uibTooltipProvider.setTriggers({
		   	'mouseenter': 'mouseleave',
		    'click': 'click',
		    'focus': 'blur',
		    'never': 'mouseleave' // <- This ensures the tooltip will go away on mouseleave
		 });
	})
	.controller('NavbarCtrl', function($scope, homeConstant){
		$scope.tab_title = homeConstant.tab_title;
		$scope.header_title = homeConstant.header_title;
	})
	.run(($rootScope, $state, $stateParams, $location, $window)=>{
		$rootScope.$state = $state;
    	$rootScope.$stateParams = $stateParams;
    	$rootScope.$on("$stateChangeSuccess", (event, toState, toParams, fromState, fromParams)=>{
	    	$rootScope.pageTitle = 'Roman Malieiev - ' + $state.current.title;
	    	$rootScope.prevState = fromState.name;
			$window.ga('send', 'pageview', {
				path: $location.path(),
				title: $rootScope.pageTitle
			});
		});
		if ($window.applicationCache) $window.applicationCache.addEventListener('updateready', ()=>
            $window.location.reload(true));
	    console.log('ready');
	});
