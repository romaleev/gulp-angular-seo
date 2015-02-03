'use strict';

var gulp = require('gulp'),
$ = gulp.$,
    path = gulp.config.path;

gulp.task('js:vendor', function() {
    return gulp.src(path.js.vendor)
        .pipe($.sourcemaps.init({
            loadMaps: true
        }))
        .pipe($.concat('vendor.js'))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(path.dist + '/scripts'));
});

gulp.task('js:user', function() {// after html:tmp
    var html = gulp.src(path.js.user)
        .pipe($.ngAnnotate())
        .pipe($.sourcemaps.init())
        .pipe($.concat('scripts'))
    var html2js = gulp.src(path.html2js)
            .pipe($.ngHtml2js({
                moduleName: "romaleev",
                prefix: ""
            }))
            .pipe($.concat("html2js"))

    return require('streamqueue')({objectMode: true}, html, html2js)
        .pipe($.uglify())
        .pipe($.concat('scripts.js'))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(path.dist + '/scripts'));
});