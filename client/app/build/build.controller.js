'use strict';

angular.module('romaleev')
    .config(function($stateProvider) {
        $stateProvider
            .state('build', {
                title: 'Gulp Build',
                url: '/build',
                templateUrl: 'app/build/build.html',
                controller: 'BuildCtrl'
            });
    })
    .constant('buildConstant', {
        development_tasks: [{
            title: 'Live Reload',
            info: 'BrowserSync live reload, watches for js/css files'
        }, {
            title: 'JADE',
            info: 'Node.js Jade rendering, inject js/css files'
        }, {
            title: 'LESS',
            info: 'Node.js LESS rendering'
        }, {
            title: 'Server',
            info: 'Nodemon server autoreload'
        }, {
            title: 'Validation',
            info: 'Lint validation, watches for js/css files'
        }],
        production_tasks: [{
            title: 'Build optimization',
            info: 'Run only tasks with changed sources'
        }, {
            title: 'HTML',
            info: 'Jade to html, inject/useref js/css files'
        }, {
            title: 'JS',
            info: 'Merge, minify, html2js cache, sourcemaps'
        }, {
            title: 'CSS',
            info: 'Less to css, merge, minify'
        }, {
            title: 'SEO',
            info: 'Phantom.js template generation, sitemap'
        }, {
            title: 'Server',
            info: 'Configured for web crawlers'
        },{
            title: 'AppCache',
            info: 'Cache manifest generator'
        }, {
            title: 'FTP',
            info: 'Uploading via FTP, cacheable'
        }, {
            title: 'Heroku',
            info: 'Publishing to Heroku, cacheable'
        }, {
            title: 'Assets',
            info: 'Imagemin image minification, fonts'
        }, {
            title: 'Clean',
            info: 'Clean temp data'
        }]
    })
    .controller('BuildCtrl', function($scope, $window, $http, buildConstant) {
        $scope.alert = alert.bind($window);
        $scope.log = console.log.bind(console);
        $scope.dev_tasks = buildConstant.development_tasks;
        $scope.prod_tasks = buildConstant.production_tasks;
        $http.get('/config.json').success(function(data) {
            $scope.config = data;
        });
    });
