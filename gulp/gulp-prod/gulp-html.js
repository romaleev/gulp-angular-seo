'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path;

gulp.task('html', function() {
    var assets = $.useref.assets();
    return gulp.src(path.html.index)
        .pipe($.jade({
            pretty: true
        }))
        .pipe($.useref())
        .pipe(gulp.dest(path.dist));
});

gulp.task('html:inject', function() {
	return gulp.src(path.html.index)
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
				return gulp.$.inject.transform.apply(gulp.$.inject.transform, arguments);
			}
		}))
		.pipe(gulp.dest(path.client));
});