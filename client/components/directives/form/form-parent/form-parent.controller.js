"use strict";

angular.module('romaleev')
    .directive('formParent', ()=>
        ({
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
            controller: function($scope, $http){
                let setDirty = (...args)=> {
                    let item = args[0];
                    if(!item || !item.$error) return;
                    if(item.$error.required === true){
                        item.$setDirty();
                    } else angular.forEach(item.$error.required, setDirty);
                };
                if(!$scope.model){
                    $scope.model = {};
                } else if(typeof $scope.model != 'object') throw new Error('non object');
                $scope.form = $scope;
                $scope._submit = ()=> {
                    if($scope.submit) $scope.submit();
                    if($scope[$scope.name].$invalid){
                        if($scope.error) $scope.error();
                        setDirty($scope[$scope.name]);
                    } else if($scope.success) $scope.success();
                };
            },
            link: (scope, element, attr, ctrl, transcludeFn)=>
                transcludeFn(scope, (clone)=>
                    element.append(clone))
        }));
