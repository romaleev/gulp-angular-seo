angular.module('romaleev')
	.config(($stateProvider)=>
	    $stateProvider
	        .state('people', {
	            url: '/people',
	            templateUrl: 'app/people/people.html',
	            controller: 'PeopleCtrl',
	            abstract: true,
	            resolve: {
	            	people: (peopleService)=>
                        peopleService.getPeople()
	            }
	        })
			.state('people.list', {
				title: 'Angular State Dashboard - People List',
				url: '/list:filter',
				templateUrl: 'app/people/people.list.html',
			})
			.state('people.grid', {
				title: 'Angular State Dashboard - People Grid',
				url: '/grid:filter',
				templateUrl: 'app/people/people.grid.html',
			})
	        .state('details', {
				title: 'Angular State Dashboard - Details',
	            url: '/details/:personId',
				templateUrl: 'app/people/details.html',
				controller: 'DetailsCtrl',
	            resolve: {
	            	person: (peopleService, $stateParams)=>
                        peopleService.getPerson($stateParams.personId)
	            }
	        }))
	.controller('PeopleCtrl', function($scope, people, peopleService){
		$scope.people = people;
		$scope.peopleService = peopleService;
	})
	.controller('DetailsCtrl', function($scope, person, peopleService){
		$scope.person = person;
		$scope.peopleService = peopleService;
	});
