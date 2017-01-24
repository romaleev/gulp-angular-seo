import gulp from 'gulp';
import _streamqueue from 'streamqueue';

let $ = gulp.$,
    conf = gulp.config,
    task = conf.task;

gulp.task('js:vendor', ()=>
    gulp.src(task.js.vendor)
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.concat(task.js.vendor_file))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(task.js.dist)));

gulp.task('js:user', ()=> {
    let js = gulp.src(task.js.user)
        .pipe($.sort((a, b)=>
            a.path.match(task.js.user_order) ? -1 : 1))
        .pipe($.ngAnnotate())
        .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe($.concat('js'));
    let html2js = gulp.src(task.html.partials)
            .pipe($.jade())
            .pipe($.ngHtml2js({
                moduleName: task.js.html2jsModuleName,
                prefix: ""
            }))
            .pipe($.concat('html2js'));

    return _streamqueue({objectMode: true}, js, html2js)
        .pipe($.uglify({ mangle: false }))
        .pipe($.concat(task.js.user_file))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(task.js.dist));
});
