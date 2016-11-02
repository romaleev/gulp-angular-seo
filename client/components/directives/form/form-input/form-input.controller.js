"use strict";

angular.module('romaleev')
    .directive('formInput', ()=>
        ({
            require: '^form',
            restrict: 'E',
            replace: true,
            scope: {
                name: '@',
                title: '@',
                type: '@',
                placeholder: '@',
                warning: '@',
                minlength: '@',
                maxlength: '@',
                pattern: '@',
                required: '@',
                onchange: '&'
            },
            templateUrl: 'components/directives/form/form-input/form-input.html',
            link: (scope, element, attrs, form)=> {
                scope.input = form[scope.name];
                scope.model = scope.$parent.model;
            }
        }));
