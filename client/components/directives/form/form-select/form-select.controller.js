"use strict";

angular.module('romaleev')
    .directive('formSelect', function() {
        return {
            require: '^form',
            restrict: 'E',
            replace: true,
            scope: {
                name: '@',
                title: '@',
                value: '@',
                data: '=',
                required: '@',
                onchange: '&'
            },
            templateUrl: 'components/directives/form/form-select/form-select.html',
            link: function(scope, element, attrs, form) {
            	scope.select = form[scope.name];
                scope.model = scope.$parent.model;
                if(scope.value){
                    if(scope.data && scope.data.indexOf(scope.value) != -1){
                        scope.model[scope.name] = scope.value;
                    } else scope.inactive = true;
                } else if(attrs.selected !== undefined){
                    if(scope.data && scope.data.length > 0)
                        scope.model[scope.name] = scope.data[0];
                } else scope.inactive = true;
            }
        };
    });
