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
	.controller('DirectoryCtrl', function($scope, peopleService) {
		peopleService.get().then(function(response) {
			var hiredCount = 0,
				hiredSum = 0;
			$scope.people = response.map(function(item, i, arr){
				var fullname = item.name.last + ', ' + item.name.first,
					hired = peopleService.isHired(item._id);
					if(hired) {
						hiredCount++;
						hiredSum += item.price;
					}
				return {
					id: item._id,
					fullname: fullname,
					about: item.about,
					aboutCut: item.about.substr(0, 99) + '...',
					thumbnail: item.picture.thumbnail,
					salary: item.price + ',000$',
					detailsUrl: '/directory/' + encodeURI(fullname),
					price: item.price,
					hired: hired
				};
			});
			$scope.hire = function(person){
				var hired = peopleService.hire(person.id);
				if(hired){
					$scope.hiredCount++;
					$scope.hiredSum += person.price;
				} else {
					$scope.hiredCount--;
					$scope.hiredSum -= person.price;
				}
				return hired;
			};
			$scope.hiredCount = hiredCount;
			$scope.hiredSum = hiredSum;
		});
	});