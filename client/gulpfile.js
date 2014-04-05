var gulp = require('gulp');

var coffee = require('gulp-coffee');
var less = require('gulp-less');

var prefix = require('gulp-autoprefixer');
var rename = require('gulp-rename');

const SOURCE_FOLDER = 'src';
const BUILD_FOLDER = 'www';

const HTTP_PORT = 8001;

const paths = {
  bower: SOURCE_FOLDER + '/bower_components/**/*',
  coffee: SOURCE_FOLDER + '/js/**/*.coffee',
  
  js: SOURCE_FOLDER + '/js/**/*.js',
  css: SOURCE_FOLDER + '/css/**/*-noprefix.css',
  index: SOURCE_FOLDER + '/index.html',
  config: SOURCE_FOLDER + '/config.xml'
};

// TODO: don't copy unnecessary stuff
gulp.task('bower', function () {
  return gulp.src(paths.bower)
    .pipe(gulp.dest(BUILD_FOLDER + '/bower_components'))
});

gulp.task('coffee', function () {
  return gulp.src(paths.coffee)
    .pipe(coffee())
    .pipe(gulp.dest(SOURCE_FOLDER + '/js'));
});

gulp.task('js', ['coffee'], function() {
  return gulp.src(paths.js)
    .pipe(gulp.dest(BUILD_FOLDER + '/js'))
});

gulp.task('css', function () {
  return gulp.src(paths.css)
    .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
    .pipe(rename(function(path) {
      path.basename = path.basename.replace('-noprefix', '')
    }))
    .pipe(gulp.dest(SOURCE_FOLDER + '/css'))
    .pipe(gulp.dest(BUILD_FOLDER + '/css'))
});

gulp.task('copy', function() {
  return gulp.src([paths.index, paths.config])
    .pipe(gulp.dest(BUILD_FOLDER))
});

// https://github.com/gulpjs/gulp/issues/100
gulp.task('http', function () {
  require('http').createServer(
    require('ecstatic')({ root: './src' })
  ).listen(HTTP_PORT);
  
  console.log('Serving files at http://localhost:' + HTTP_PORT);
  // var spawn = require('child_process').spawn;
  // spawn('open', ['http://localhost:' + HTTP_PORT], { cwd: process.cwd() });
});

gulp.task('build', ['bower', 'copy', 'js', 'css']);

gulp.task('watch', function () {
  gulp.watch(paths.coffee, ['coffee']);
  gulp.watch(paths.css, ['css']);
});

gulp.task('development', ['http', 'watch']);
