'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path;

gulp.task('h1', function() {
    /*var l = require('lazypipe')().pipe(function(){
        on('data', function(file) {
            console.log(file.history[0]);
        });
    });*/
    //console.log(gulp.tasks['h0'].fn());
    /*if(!gulp.htmlTmp) gulp.htmlTmp = gulp.src(path.html.src)
            .pipe($.debug())
            .pipe($.jade({
                pretty: true
            }));*/
    return gulp.src(path.html.src)
        .pipe($.debug())
        .pipe($.jade({
            pretty: true
        }))
        .pipe($.filter('**/index.html'))
        .pipe($.debug());
    //.pipe($.if('**/index.html', $.debug()))

});

gulp.task('html', function() {
    var assets = $.useref.assets();
    return gulp.src(path.html.index)
        .pipe($.jade({
            pretty: true
        }))
        .pipe(assets)
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(path.dist));
});