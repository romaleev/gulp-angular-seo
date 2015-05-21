"use strict";

angular.module('romaleev')
    .directive('formParent', function() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                name: '@',
                title: '@',
                model: '=',
                submit: '&',
                success: '&',
                error: '&',
                onchange: '&',
                json: '@'
            },
            templateUrl: 'components/directives/form/form-parent/form-parent.html',
            controller: function($scope, $http) {
                if(!$scope.model){
                    $scope.model = {};
                } else if(typeof $scope.model != 'object') throw new Error('non object');
                $scope.form = $scope;
                $scope._submit = function(){
                    if($scope.submit) $scope.submit();
                    if($scope[$scope.name].$invalid){
                        if($scope.error) $scope.error();
                        setDirty($scope[$scope.name]);
                    } else if($scope.success) $scope.success();
                };
                function setDirty(){
                    var item = arguments[0];
                    if(!item || !item.$error) return;
                    if(item.$error.required === true){
                        item.$setDirty();
                    } else angular.forEach(item.$error.required, setDirty);
                }
            },
            link: function(scope, element, attr, ctrl, transcludeFn) {
                transcludeFn(scope, function(clone) {
                    element.append(clone);
                });
            }
        };
    });
