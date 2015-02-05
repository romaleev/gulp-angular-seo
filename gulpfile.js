'use strict';

var gulp = require('gulp');
gulp.$ = require('gulp-load-plugins')();
gulp.config = require('./config.json');
var path = gulp.config.path;

require('require-dir')('./gulp');

gulp.task('clean', function(cb) {
	require('del')([
		dist + '/**/*.*',
		tmp + '/**/*.*'
	], cb);
});

gulp.task('inject', function() {
	return gulp.src('client/index.jade')
		.pipe(gulp.$.inject(gulp.src(path.js.vendor, {read: false}), {
			name: 'vendorJS',
			addRootSlash: false,
			relative: true
		}))
		.pipe(gulp.$.inject(gulp.src(path.css.vendor, {read: false}), {
			name: 'vendorCSS',
			addRootSlash: false,
			relative: true
		}))
		.pipe(gulp.$.inject(gulp.src(path.js.user, {read: false}), {
			name: 'userJS',
			addRootSlash: false,
			relative: true
		}))
		.pipe(gulp.$.inject(gulp.src(path.css.user, {read: false}), {
			name: 'userCSS',
			addRootSlash: false,
			relative: true,
			transform: function(filepath) {
				if (filepath.slice(-5) === '.less') {
					return 'link(rel="stylesheet", href="' + filepath.slice(0, -4) + 'css")';
				}
				return inject.transform.apply(inject.transform, arguments);
			}
		}))
		.pipe(gulp.dest('client'));
});

gulp.task('default', ['dev']);
gulp.task('serve', ['dev']);
gulp.task('d', ['dev']);
gulp.task('p', ['prod']);
gulp.task('f', ['ftp']);
gulp.task('po', ['prod:opt']);
gulp.task('fo', ['ftp:opt']);