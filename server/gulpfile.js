var gulp = require('gulp');
var coffee = require('gulp-coffee');
var jasmine = require('gulp-jasmine');
var nodemon = require('gulp-nodemon');

const paths = {
    specCoffee: 'spec/**/*.coffee',
	specAPI: 	'spec/api/'
};

gulp.task('test', function () {

    gulp.src(paths.specCoffee)
        .pipe(coffee())
        .pipe(gulp.dest('spec'))
        .pipe(jasmine({verbose: true, includeStackTrace: true}));
});

gulp.task('testapi', function () {
    gulp.src(paths.specAPI)
        .pipe(gulp.dest(paths.specAPI))
        .pipe(jasmine({verbose: true, includeStackTrace: true}));
});

gulp.task('nodemon', function () {
  nodemon({ script: './server.js' })
});

gulp.task('development', ['nodemon']);
gulp.task('default', ['development']);
