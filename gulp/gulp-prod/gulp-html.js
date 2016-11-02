import gulp from 'gulp';

let $ = gulp.$,
    conf = gulp.config,
    task = conf.task;

gulp.task('html', ()=> {
    let assets = $.useref.assets();
    return gulp.src(task.html.index)
        .pipe($.jade({
            pretty: true
        }))
        .pipe($.useref())
        .pipe(gulp.dest(task.common.dist));
});
