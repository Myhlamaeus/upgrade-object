var gulp = require('gulp')
var babel = require('gulp-babel')
var sourcemaps = require('gulp-sourcemaps')

gulp.task('build', function() {
  return gulp.src('upgrade-object.js')
    .pipe(sourcemaps.init())
      .pipe(babel())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('dist'))
})
