angular.module('romaleev')
	.filter('fieldFilter', ()=>
        (input) =>
            input ? Object.keys(input) : []);
