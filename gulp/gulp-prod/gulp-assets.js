import gulp from 'gulp';

let $ = gulp.$,
    conf = gulp.config,
    task = conf.task;

gulp.task('assets', ['assets:fonts', 'assets:images', 'assets:build']);

gulp.task('assets:fonts', ()=>
    gulp.src(task.assets.fonts.src)
        .pipe($.if(conf.debug, $.debug({
            title: "fonts:"
        })))
        .pipe(gulp.dest(task.assets.fonts.dist)));

gulp.task('assets:images', ()=>
    gulp.src(task.assets.images.src)
        .pipe($.if(conf.debug, $.debug({
            title: "images:"
        })))
        .pipe($.imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(task.assets.images.dist)));

gulp.task('assets:build', ()=>
    gulp.src(task.common.config)
        .pipe(gulp.dest(task.common.dist)));
