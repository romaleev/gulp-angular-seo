'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path;

gulp.task('js:vendor', function() {
    return gulp.src(path.js.vendor)
        .pipe($.sourcemaps.init({
            loadMaps: true
        }))
        .pipe($.concat(path.js.vendor_file))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(path.js.dist));
});

gulp.task('js:user', function() {
    var js = gulp.src(path.js.user)
        .pipe($.ngAnnotate())
        .pipe($.sourcemaps.init())
        .pipe($.concat('js'));
    var html2js = gulp.src(path.html.partials)
            .pipe($.jade())
            .pipe($.ngHtml2js({
                moduleName: path.js.html2jsModuleName,
                prefix: ""
            }))
            .pipe($.concat('html2js'));

    return require('streamqueue')({objectMode: true}, js, html2js)
        .pipe($.uglify())
        .pipe($.concat(path.js.user_file))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(path.js.dist));
});