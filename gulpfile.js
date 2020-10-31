var
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber');

var onError = function (err) {
    notify.onError({
        title: "Gulp",
        subtitle: "Failure!",
        message: "Error: <%= error.message %>",
        sound: "Beep"
    })(err);
    this.emit('end');
};

gulp.task('bundle', function () {
    return gulp.src('src/js/virtual-keyboard.js')
        .pipe(plumber({errorHandler: onError}))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'))
});

gulp.task('styles', function () {
    return gulp.src('src/scss/style.scss')
        .pipe(plumber({errorHandler: onError}))
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(prefixer([
            'last 2 versions',
            '> 0.2%',
            'ie >= 9'
        ]))
        .pipe(sourcemaps.write())
        .pipe(rename({
            prefix: 'vitual-keybaord',
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/'))
        .pipe(livereload())
});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch('src/js/**/*.js', ['bundle']);
    gulp.watch('src/scss/**/*.scss', ['styles']);
});

gulp.task('default', ['watch']);