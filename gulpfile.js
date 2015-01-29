'use strict';

var gulp = require('gulp'),
	del = require('del');

gulp.path = {
	devURL: 'http://localhost:8000',
	prodURL: 'http://localhost:7997',
	dist: 'dist',
	tmp: 'tmp',
	bower: 'client/bower_components'
}
gulp.ftpConfig = require('./ftp.json');

if(!gulp.ftpConfig) throw new Error('Define ./ftp.json with host, port, user, pass and remotePath fields.');

require('require-dir')('./gulp');

gulp.task('clean', function(cb) {
	del([
		dist + '/**/*.*',
		tmp + '/**/*.*'
	], cb);
});

gulp.task('serve', ['dev']);

gulp.task('default', ['dev']);