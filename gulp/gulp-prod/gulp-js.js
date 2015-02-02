'use strict';

var gulp = require('gulp'),
$ = gulp.$,
    path = gulp.config.path;

gulp.task('js:vendor', function() {
    return gulp.src([
            path.bower + '/jquery/dist/jquery.min.js',
            path.bower + '/angular/angular.min.js',
            path.bower + '/angular-route/angular-route.min.js',
            path.bower + '/angular-sanitize/angular-sanitize.min.js',
            path.bower + '/bootstrap/dist/js/bootstrap.min.js'
            //path.bower + '/bootstrap/js/collapse.js'
        ])
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.concat('vendor.js'))
        // .pipe($.uglify())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(path.dist + '/scripts'));
});

gulp.task('js:user', function() {// after html:tmp
    var html = gulp.src([
            'client/**/*.js',
            '!' + path.bower + '/**'
        ])
        .pipe($.ngAnnotate())
        .pipe($.sourcemaps.init())
        .pipe($.concat('scripts'))
    var html2js = gulp.src([
                path.tmp + '/html/**/*.html',
                '!' + path.tmp + '/html/index.html'
            ])
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