/** @jsx React.DOM */

define([
  'react',
  'fastclick',
  'view/AppView'
], function (React, FastClick, AppView) {
  React.initializeTouchEvents(true);

  document.addEventListener("deviceready", function () {
    FastClick.attach(document.body);
    React.renderComponent(
      <AppView />, document.body
    );
  }, false);

  if (typeof navigator.notification === 'undefined') {
    document.dispatchEvent(new CustomEvent("deviceready"));
  }
});