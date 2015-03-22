'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path,
    bluebird = require('bluebird'),
    fs = bluebird.promisifyAll(require('fs')),
    mkdirp = bluebird.promisify(require('mkdirp'));

gulp.task('css:vendor_init', function(cb) {// init empty vendor.css to prevent seo warning before it is generated
    var file = path.css.dist + '/' + path.css.vendor_file;
    fs.openAsync(file, 'r').catch(function(err){
        return mkdirp(path.css.dist).then(fs.writeFileAsync(file, ''));
    }).finally(cb);
});

gulp.task('css:vendor', function() {//TODO add sourcemaps when uncss will be supported
    return gulp.src(path.css.vendor)
        .pipe($.concat(path.css.vendor_file))
        .pipe($.uncss(path.css.uncss))
        .pipe($.minifyCss())
        .pipe(gulp.dest(path.css.dist));
});

gulp.task('css:user', function() {
    return gulp.src(path.css.user)
        .pipe($.sourcemaps.init())
        .pipe($.less())
        .pipe($.minifyCss())
        .pipe($.concat(path.css.user_file))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(path.css.dist));
});

//TODO for generator
//    .pipe($.if('*.less', $.less()))
//    .pipe($.if('*.scss', $.sass()))