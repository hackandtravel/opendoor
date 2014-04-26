/** @jsx React.DOM */

define([
  'react',
  'fastclick',
  'view/AppView'
], function (React, FastClick, AppView) {
  React.initializeTouchEvents(true);

  function launch() {
    FastClick.attach(document.body);
    React.renderComponent(
      <AppView />, document.body
    );
  }

  var isCordova = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
  if (isCordova) {
    document.addEventListener("deviceready", launch, false);
  } else {
    launch();
  }
});