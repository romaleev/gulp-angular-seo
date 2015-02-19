'use strict';

var gulp = require('gulp'),
	$ = gulp.$,
	path = gulp.config.path,
	devPath = gulp.config.devPath;
	//clientPath = path.join(__dirname, '/../client'),
	//bowerPath = path.join(__dirname, '/../bower_components'),
/*    serveStatic = require('serve-static'),
    serveIndex = require('serve-index');

gulp.task('connect', function () {
  var app = require('connect')()
    .use(require('connect-livereload')({port: 35729}))
    .use(serveStatic('client'))
    .use('/bower_components', serveStatic('bower_components'))
    .use(serveIndex('client'));

    require('http').createServer(app).listen(9000).on('listening', function () {
      console.log('Started connect web server on http://localhost:9000');
    });
});

gulp.task('dev:connect', ['connect'], function() {
  	$.livereload.listen();

  	$.watch(devPath.validate, {ignoreInitial: false})
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'));
    $.watch(devPath.liveReload, {events: ['change']}, $.livereload.changed);

    require('opn')('http://localhost:9000', gulp.config.browser);
});*/

gulp.task('nodemonl', function(cb) {
  var called = false;

  return $.nodemon({
    script: path.server.dev,
    ext: 'js',
    watch: path.server.dev,
    verbose: gulp.config.debug
  }).on('start', function() {
    if (!called) {
      called = true;
      $.livereload({start: true});
      cb();
    }
  }).on('restart', function() {
    $.livereload.reload();
  });
});

gulp.task('devl', ['inject', 'nodemonl'], function() {
    $.watch(devPath.validate, {ignoreInitial: false})
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'));

    $.watch(devPath.liveReload, {events: ['change']}, $.livereload.changed);

    require('opn')('http://localhost:8000');
  /*$.watch(devPath.browserSync.reload, {events: ['change']}, $.liveReload.reload);

  $.watch(devPath.browserSync.inject, {events: ['change']})
    .pipe($.rename(function(path) {
      path.extname = '.css';
    }))
    .pipe($.liveReload()));*/
});