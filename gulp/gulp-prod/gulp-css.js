import gulp from 'gulp';

let $ = gulp.$,
    conf = gulp.config,
    task = conf.task;

gulp.task('css:vendor_init', (cb)=> { // init empty vendor.css to prevent seo warning before it is generated
    let file = task.css.dist + '/' + task.css.vendor_file,
        end = ()=> cb();
    $.fs.open(file, 'r')
        .then(end)
        .catch((err)=>
            $.mkdirp(task.css.dist)
                .then(()=>
                    $.fs.writeFile(file, ''))
                .then(end));
});

gulp.task('css:vendor', ()=> //TODO add sourcemaps when uncss will be supported
    gulp.src(task.css.vendor)
        .pipe($.concat(task.css.vendor_file))
        // .pipe($.uncss(task.css.uncss))
        .pipe($.minifyCss())
        .pipe($.replace(/\@font-face\{.*?\}/g,'')) //font-face declaration cut
        .pipe(gulp.dest(task.css.dist)));

gulp.task('css:user', ()=>
    gulp.src(task.css.user)
        .pipe($.sourcemaps.init())
        .pipe($.less())
        .pipe($.minifyCss())
        .pipe($.concat(task.css.user_file))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(task.css.dist)));

//TODO for generator
//    .pipe($.if('*.less', $.less()))
//    .pipe($.if('*.scss', $.sass()))
