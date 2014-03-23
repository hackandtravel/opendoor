var gulp = require('gulp');
var coffee = require('gulp-coffee');
var jasmine = require('gulp-jasmine');
var nodemon = require('gulp-nodemon');

const paths = {
    specCoffee: 'spec/**/*.coffee'
};

gulp.task('test', function () {
    gulp.src(paths.specCoffee)
        .pipe(coffee())
        .pipe(gulp.dest('spec'))
        .pipe(jasmine({verbose: true, includeStackTrace: true}));
});

gulp.task('nodemon', function () {
  nodemon({ script: './server.js' })
});

gulp.task('development', ['nodemon']);
