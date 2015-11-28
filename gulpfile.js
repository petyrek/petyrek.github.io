var gulp = require('gulp');
var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
var cssshrink = require('gulp-cssshrink');
var connect = require('gulp-connect');
var open = require('gulp-open');
var rimraf = require('rimraf');
var uglify = require('gulp-uglifyjs');
var asciify = require('asciify');

gulp.task('default', ['less', 'uglify', 'connect', 'open', 'watch'], function() {
    asciify('personal web', {color:'red', font: 'smshadow'}, function(err, res){ console.log(res); });
});

gulp.task('connect', function() {
    connect.server({
        livereload: true,
        root: ''
    });
});

gulp.task('open', function() {
  gulp.src('')
  .pipe(open({uri: 'http://localhost:8080'}));
});

gulp.task('less', function () {
    gulp.src('./less/*.less')
        .pipe(less())
        .pipe(prefix())
        .pipe(cssshrink())
        .pipe(gulp.dest('./'))
        .pipe(connect.reload());
});

gulp.task('uglify', function() {
    gulp.src('./js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
    gulp.watch('./less/*.less', ['less']);
    gulp.watch('./js/*.js', ['uglify']);
});
