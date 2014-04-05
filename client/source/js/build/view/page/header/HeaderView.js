/** @jsx React.DOM */
define([
  'react'
], function (React) {
  return React.createClass({
    render: function () {

      var header;
      if (!this.props.loading) {
        header = this.props.header;
      } else {
        header = React.DOM.div( {className:"loading"});
      }

      return (
        React.DOM.nav( {id:"header", className:"navbar navbar-default navbar-fixed-top", role:"navigation"}, 
          React.DOM.a( {id:"new-door-brand", className:"navbar-brand new-door-page"}, header),
          this.props.children
        ));
    }
  });
});
