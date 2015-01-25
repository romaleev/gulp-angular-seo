'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')(),
    // vinylPaths = require('vinyl-paths'),
    del = require('del');

require('require-dir')('./gulp');

gulp.task('install', function(cb) {
	del(['tmp/**/*.*'], cb);
});

gulp.task('clean:npm', function(){
	 return gulp.src(['node_modules', 'client/bower_components'], {read: false})
        .pipe(vinylPaths(del))
        .pipe(gulp.start('install'));
});

gulp.task('serve', ['dev']);

gulp.task('default', $.sync(gulp).sync(['install', 'serve']));
