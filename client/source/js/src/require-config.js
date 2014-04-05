require.config({
  baseUrl: 'js/build',
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
  }
});

// TODO: Remove this, dont use global namespace
var app = { location: "http://192.168.0.15:9000" };

require(['main'], function () {
  require(['view/run']);
});
