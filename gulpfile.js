var gulp = require('gulp');
var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
var cssshrink = require('gulp-cssshrink');
var connect = require('gulp-connect');
var open = require('gulp-open');
var uglify = require('gulp-uglify');

gulp.task('default', ['less', 'uglify', 'connect', 'open', 'watch']);

gulp.task('connect', function() {
  return connect.server({
    livereload: true,
    root: ''
  });
});

gulp.task('open', function() {
  return gulp.src('')
  .pipe(open({uri: 'http://localhost:8080'}));
});

gulp.task('less', function () {
  gulp.src('./web/less/dashboard.less')
  .pipe(less())
  .pipe(prefix())
  .pipe(cssshrink())
  .pipe(gulp.dest('./web/dist/'))
  .pipe(connect.reload());

  return gulp.src('./web/less/style.less')
  .pipe(less())
  .pipe(prefix())
  .pipe(cssshrink())
  .pipe(gulp.dest('./web/dist/'))
  .pipe(connect.reload());
});

gulp.task('uglify', function() {
  return gulp.src('./web/js/**/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('./web/dist/'))
  .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch('./web/less/**/*', ['less']);
  gulp.watch('./web/js/**/*', ['uglify']);
});
