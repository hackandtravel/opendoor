/** @jsx React.DOM */

define([
  'react',
  'fastclick',
  'view/AppView'
], function (React, FastClick, AppView) {
  React.initializeTouchEvents(true);

  // document.addEventListener("touchstart", function(){}, true);

  document.addEventListener("deviceready", function () {
    FastClick.attach(document.body);
    React.renderComponent(
      AppView(null ), document.body
    );
  }, false);

  /*
   if (!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
   document.dispatchEvent(new CustomEvent("deviceready"));
   }
   */

  // TODO
  document.dispatchEvent(new CustomEvent("deviceready"));
});