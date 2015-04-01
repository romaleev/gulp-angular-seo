'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    conf = gulp.config,
    task = conf.task,
    _streamqueue = require('streamqueue');

gulp.task('js:vendor', function() {
    return gulp.src(task.js.vendor)
    .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.concat(task.js.vendor_file))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(task.js.dist));
});

gulp.task('js:user', function() {
    var js = gulp.src(task.js.user)
        .pipe($.sort(function (a, b) {
            return a.path.match(task.js.user_order) ? -1 : 1;
        }))
        .pipe($.ngAnnotate())
        .pipe($.sourcemaps.init())
        .pipe($.concat('js'));
    var html2js = gulp.src(task.html.partials)
            .pipe($.jade())
            .pipe($.ngHtml2js({
                moduleName: task.js.html2jsModuleName,
                prefix: ""
            }))
            .pipe($.concat('html2js'));

    return _streamqueue({objectMode: true}, js, html2js)
        .pipe($.uglify())
        .pipe($.concat(task.js.user_file))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(task.js.dist));
});
