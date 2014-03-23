var gulp = require('gulp');
var coffee = require('gulp-coffee');
var jasmine = require('gulp-jasmine');

const paths = {
  specCoffee: 'spec/**/*.coffee'
};

gulp.task('test', function () {
  gulp.src(paths.specCoffee)
    .pipe(coffee())
    .pipe(gulp.dest('spec'))
    .pipe(jasmine({verbose: true, includeStackTrace: true}));
});

