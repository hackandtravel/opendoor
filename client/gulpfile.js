var gulp = require('gulp');
var gutil = require('gulp-util');

var react = require('gulp-react');
var coffee = require('gulp-coffee');
var less = require('gulp-less');
var imagemin = require('gulp-imagemin');

var rjs = require('gulp-requirejs');
var uglify = require('gulp-uglify');
var prefix = require('gulp-autoprefixer');

var minifyHTML = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');

const SOURCE_FOLDER = 'source';
const BUILD_FOLDER = 'www';

const HTTP_PORT = 8000;

var paths = {
  bower: SOURCE_FOLDER + 'bower_components/**/*',

  js: SOURCE_FOLDER + '/js/src/**/*.js',
  jsx: SOURCE_FOLDER + '/js/src/**/*.jsx',
  coffee: SOURCE_FOLDER + '/js/src/**/*.coffee',
  less: SOURCE_FOLDER + '/css/src/**/*.less',
  images: SOURCE_FOLDER + '/img/*',

  requireConfig: SOURCE_FOLDER + '/js/require-config.js',

  css: SOURCE_FOLDER + '/**/*.css',
  bootstrapCss: SOURCE_FOLDER + 'bower_components/bootstrap/dist/css/bootstrap.css',
  fontAwesomeCss: SOURCE_FOLDER + 'bower_components/fontawesome/css/font-awesome.css',

  index: SOURCE_FOLDER + '/index.html',
  config: SOURCE_FOLDER + '/config.xml',

  spec: SOURCE_FOLDER + '/spec/*.coffee'
};

// TODO: don't copy unnecessary stuff
gulp.task('bower', function () {
  return gulp.src(paths.bower)
    .pipe(gulp.dest(BUILD_FOLDER + '/bower_components'))
});

gulp.task('js', function() {
  return gulp.src(paths.js)
    .pipe(gulp.dest(SOURCE_FOLDER + '/js/build'))
});

gulp.task('jsx', function () {
  return gulp.src(paths.jsx)
    .pipe(react())
    .pipe(gulp.dest(SOURCE_FOLDER + '/js/build'));
});

gulp.task('coffee', function () {
  return gulp.src(paths.coffee)
    .pipe(coffee())
    .pipe(gulp.dest(SOURCE_FOLDER + '/js/build'));
});

gulp.task('less', function () {
  return gulp.src(paths.less)
    .pipe(less())
    .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
    .pipe(gulp.dest(SOURCE_FOLDER + '/css/build'));
});

gulp.task('images', function () {
  return gulp.src(paths.images)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(BUILD_FOLDER + '/img'));
});

gulp.task('compile', ['jsx', 'coffee', 'less', 'images']);

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(paths.jsx, ['jsx']);
  gulp.watch(paths.coffee, ['coffee']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.less, ['less']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.spec, ['spec']);
});

// simply copy config.xml
gulp.task('config', function () {
  return gulp.src(paths.config).pipe(gulp.dest(BUILD_FOLDER))
});

gulp.task('index', function () {
  return gulp.src(paths.index)
    .pipe(minifyHTML())
    .pipe(gulp.dest(BUILD_FOLDER))
});

gulp.task('css', function () {
  return gulp.src(paths.css)
    .pipe(minifyCSS())
    .pipe(gulp.dest(BUILD_FOLDER))
});

gulp.task('rjs', ['compile'], function () {
  return rjs({
    baseUrl: SOURCE_FOLDER + '/js/build',
    paths: {
      backbone: '../../bower_components/backbone/backbone',
      bootstrap: '../../bower_components/bootstrap/dist/js/bootstrap',
      director: '../../bower_components/director/build/director',
      fastclick: '../../bower_components/fastclick/lib/fastclick',
      jquery: '../../bower_components/jquery/dist/jquery',
      moment: '../../bower_components/moment/moment',
      react: '../../bower_components/react/react-with-addons',
      underscore: '../../bower_components/underscore/underscore'
    },
    shim: {
      backbone: {
        exports: 'Backbone'
      },
      director: {
        exports: 'Router'
      },
      fastclick: {
        exports: 'FastClick'
      },
      jquery: {
        exports: '$'
      },
      moment: {
        exports: 'moment'
      },
      react: {
        exports: "React"
      },
      underscore: {
        exports: '_'
      }
    },
    name: 'view/run',
    out: 'main.js'
  })
    .pipe(uglify())
    .pipe(gulp.dest(BUILD_FOLDER + '/js/build'))
});

gulp.task('requireConfig', function() {
  return gulp.src(paths.requireConfig)
    .pipe(uglify())
    .pipe(gulp.dest(BUILD_FOLDER + '/js/build'))
});

gulp.task('copy', ['config', 'bower', 'index', 'css', 'requireConfig']);

gulp.task('build', ['copy', 'rjs']);

function server(root) {
  require('http').createServer(
    require('ecstatic')({ root: root })
  ).listen(HTTP_PORT);

  gutil.log('Serving files at http://localhost:' + HTTP_PORT);
}

gulp.task('http', function () {
  server(SOURCE_FOLDER)
});

gulp.task('http-www', function () {
  server(BUILD_FOLDER)
});

gulp.task('development', ['watch', 'http']);
