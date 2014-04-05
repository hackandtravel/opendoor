/** @jsx React.DOM */
define([
  'react',
  'pages'
], function (React, PAGE) {
  return React.createClass({
    render: function () {
      var cx = React.addons.classSet;
      var classes = cx({
        'page': true,
        'page-left': this.props.page !== PAGE.HOME,
        'page-middle': this.props.page === PAGE.HOME,
        'page-right': false
      });

      var doors = this.props.doors.map(function(door) {
        return (
          React.DOM.option( {value:door.number, 'data-deviceid':door.deviceId}, door.name)
          );
      });

      var style = { margin: 7 };
      return (
        React.DOM.div( {id:"page-open-door", className:classes}, 
          React.DOM.nav( {id:"header", className:"navbar navbar-default navbar-fixed-top", role:"navigation"}, 
            React.DOM.a( {id:"open-door-brand", className:"navbar-brand open-door-page"}, "OpenDoor"),
            React.DOM.a( {id:"btn-new", className:"btn btn-default open-door-page pull-right", style:style, href:"/#/login"}, 
              React.DOM.span( {className:"glyphicon glyphicon-plus"})
            )
          ),
          React.DOM.div( {className:"row"}, 
            React.DOM.div( {className:"col-md-12"}, 
              React.DOM.div(null , 
                React.DOM.label( {htmlFor:"door-select"}, "Choose a door:"),
                React.DOM.select( {id:"select-door", className:"form-control"}, 
                doors
                )
              )
            ),
            React.DOM.button( {id:"btn-open-door", type:"button", className:"btn btn-default {{disabled}}"}, 
              React.DOM.span( {className:"glyphicon glyphicon-lock"})
            )
          )
        ));
    }
  });
});