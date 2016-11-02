"use strict";

angular.module('romaleev')
    .directive('formSubmit', ()=>
        ({
            require: '^form',
            restrict: 'E',
            replace: true,
            scope: {
                name: '@',
                title: '@',
                onclick: '&'
            },
            templateUrl: 'components/directives/form/form-submit/form-submit.html',
            link: (scope, element, attrs, form)=>
                scope.form = form
        }));
