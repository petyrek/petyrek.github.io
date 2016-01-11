var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var connect = require('gulp-connect');
var open = require('gulp-open');


gulp.task('default', ['babel', 'connect', 'open', 'watch']);

gulp.task("babel", function () {
  return gulp.src("src/**/*.js")
    .pipe(concat("game.js"))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload());
});

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

gulp.task('watch', function () {
  gulp.watch('./src/**/*', ['babel']);
});
