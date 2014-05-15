var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var jasmine = require('gulp-jasmine');
var tap = require('gulp-tap');

var fs = require('fs');

const RASPBERRY_USERNAME = 'pi';
//const RASPBERRY_IP = '192.168.1.10';
const RASPBERRY_IP = '192.168.0.101';
const RASPBERRY_FOLDER_NAME = 'raspberry';

const paths = {
  js: '*.js',
  specCoffee: 'spec/**/*.coffee'
};

var files = [];

gulp.task('hack', function () {
  files = [];
  return gulp.src(paths.js)
    .pipe(tap(function (file) {
      files.push(file.path);
    }));
});

Array.prototype.flatten = function () {
  return this.reduce(function (a, b) {
    return a.concat(b);
  }, []);
};

gulp.task('scp', ['hack'], function () {

  // http://www.pauljoyceuk.com/codex/2013/raspberry-pi-configuring-and-connecting-with-ssh/
  var spawn = require('child_process').spawn;
  var params = [files, RASPBERRY_USERNAME + '@' + RASPBERRY_IP + ':' + RASPBERRY_FOLDER_NAME].flatten();
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
    gutil.log(child.stderr);
    if (code == 0) {
      gutil.log("Sent files to server:");
      files.forEach(function (file) {
        gutil.log(file)
      });
    }
  });
});

gulp.task('watch', function () {
  gulp.watch(paths.js, ['scp']);
});

gulp.task('test', function () {
  gulp.src(paths.specCoffee)
    .pipe(coffee())
    .pipe(gulp.dest('spec'))
    .pipe(jasmine({verbose: true, includeStackTrace: true}));
});

gulp.task('development', ['watch']);
gulp.task('default', ['development']);
