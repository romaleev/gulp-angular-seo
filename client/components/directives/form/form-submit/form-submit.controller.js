"use strict";

angular.module('romaleev')
    .directive('formSubmit', function() {
        return {
            require: '^form',
            restrict: 'E',
            replace: true,
            scope: {
                name: '@',
                title: '@',
                onclick: '&'
            },
            templateUrl: 'components/directives/form/form-submit/form-submit.html',
            link: function(scope, element, attrs, form) {
                scope.form = form;
            }
        };
    });
