'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    task = gulp.config.task;

gulp.task('html', function() {
    var assets = $.useref.assets();
    return gulp.src(task.html.index)
        .pipe($.jade({
            pretty: true
        }))
        .pipe($.useref())
        .pipe(gulp.dest(task.common.dist));
});

gulp.task('html:inject', function() {
	return gulp.src(task.html.index)
		.pipe(gulp.$.inject(gulp.src(task.js.vendor, {read: false}), {
			name: 'vendorJS',
			addRootSlash: false,
			relative: true
		}))
		.pipe(gulp.$.inject(gulp.src(task.css.vendor, {read: false}), {
			name: 'vendorCSS',
			addRootSlash: false,
			relative: true
		}))
		.pipe(gulp.$.inject(
			gulp.src(task.js.user, {read: false})
				.pipe($.sort(function (a, b) {
				    return a.path.match(task.js.user_order) ? -1 : 1;
				})), {
			name: 'userJS',
			addRootSlash: false,
			relative: true
		}))
		.pipe(gulp.$.inject(gulp.src(task.css.user, {read: false}), {
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
		.pipe(gulp.dest(task.common.client));
});
