import gulp from 'gulp';
import _browserSync from 'browser-sync';

let	$ = gulp.$,
	task = gulp.config.task;

gulp.task('html:inject', ()=>
	gulp.src(task.html.index)
		.pipe($.inject(gulp.src(task.js.vendor, {read: false}), {
			name: 'vendorJS',
			addRootSlash: false,
			relative: true
		}))
		.pipe($.inject(gulp.src(task.css.vendor, {read: false}), {
			name: 'vendorCSS',
			addRootSlash: false,
			relative: true
		}))
		.pipe($.inject(
			gulp.src(task.js.user, {read: false})
                .pipe($.babel({
                    presets: ['es2015']
                }))
				.pipe($.sort((a, b)=>
				    a.path.match(task.js.user_order) ? -1 : 1)), {
			name: 'userJS',
			addRootSlash: false,
			relative: true
		}))
		.pipe($.inject(gulp.src(task.css.user, {read: false}), {
			name: 'userCSS',
			addRootSlash: false,
			relative: true,
			transform: (...args)=> {
                let filepath = args[0];
				if (filepath.slice(-5) === '.less') {
					return 'link(rel="stylesheet", href="' + filepath.slice(0, -4) + 'css")';
				}
				return $.inject.transform.apply($.inject.transform, args);
			}
		}))
		.pipe(gulp.dest(task.common.client)));

gulp.task('nodemon', (cb)=> {
	let called = false;

	return $.nodemon({
		script: task.server.dev,
		ext: 'js',
		watch: task.server.dev
	}).on('start', ()=> {
		if (!called) {
			called = true;
			_browserSync({
				proxy: gulp.config.url.server.dev,
				browser: gulp.config.browser,
				notify: false,
				logLevel: gulp.config.debug ? "debug" : "silent"
			}, cb);
		}
	}).on('restart', ()=>
		_browserSync.reload());
});

gulp.task('dev', ['html:inject', 'nodemon'], ()=> {
	console.warn('Server is running: ' + gulp.config.url.server.dev);

	$.watch(task.validate, {ignoreInitial: false})
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'));

	$.watch(task.browserSync.reload, {events: ['change']}, _browserSync.reload);

	$.watch(task.browserSync.inject, {events: ['change']})
		.pipe($.rename((path)=>
			path.extname = '.css'))
		.pipe(_browserSync.reload({
			stream: true
		}));
});
