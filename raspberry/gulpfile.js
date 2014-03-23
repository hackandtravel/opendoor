var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var jasmine = require('gulp-jasmine');

var spawn = require('child_process').spawn;

const RASPBERRY_USERNAME = 'pi';
const RASPBERRY_IP = '192.168.1.108';
const RASPBERRY_FOLDER_NAME = 'raspberry';

const paths = {
  js: '**/*.js*',
  specCoffee: 'spec/**/*.coffee'
};

gulp.task('scp', function () {
  // http://www.pauljoyceuk.com/codex/2013/raspberry-pi-configuring-and-connecting-with-ssh/
  var params = [paths.js, RASPBERRY_USERNAME + '@' + RASPBERRY_IP + ':' + RASPBERRY_FOLDER_NAME];
  var child = spawn('scp', params, { cwd: process.cwd() });
  var stdout = '';
  var stderr = '';
  
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', function (data) {
    stdout += data;
    gutil.log(data);
  });

  child.stderr.setEncoding('utf8');
  child.stderr.on('data', function (data) {
    stderr += data;
    gutil.log(gutil.colors.red(data));
    gutil.beep();
  });

  child.on('close', function (code) {
    gutil.log("Done with exit code", code);
    gutil.log("You access complete stdout and stderr from here"); // stdout, stderr
  });
});

gulp.task('watch', function() {
  gulp.watch(paths.js, ['scp']);
});

gulp.task('test', function () {
  gulp.src(paths.specCoffee)
    .pipe(coffee())
    .pipe(gulp.dest('spec'))
    .pipe(jasmine({verbose: true, includeStackTrace: true}));
});
