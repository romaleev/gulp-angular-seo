"use strict";

angular.module('romaleev')
    .directive('formDate', function() {
        return {
            require: '^form',
            restrict: 'E',
            replace: true,
            scope: {
                name: '@',
                title: '@',
                required: '@'
            },
            templateUrl: 'components/directives/form/form-date/form-date.html',
            link: function(scope, element, attrs, form) {
                if(!scope.$parent.model[scope.name]) scope.$parent.model[scope.name] = {};
                scope.model = scope.$parent.model[scope.name];
                scope.required = attrs.required !== undefined;
                var days = [];
                for(var i = 1; i <= 31; i++)
                    days.push(i);
                scope.days = days;
                scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                function update(newValue, oldValue){
                    if(scope.model.month && scope.model.year){
                        var days = new Date(scope.model.year, scope.months.indexOf(scope.model.month) + 1, 0).getDate();
                        if(scope.model.day > days) scope.model.day = days;
                        while(scope.days.length != days){
                            if(scope.days.length < days){
                                scope.days.push(scope.days.length + 1);
                            } else scope.days.pop();
                        }
                    }
                }
                scope.$watch('model.month', update, true);
                scope.$watch('model.year', update, true);
            }
        };
    });
