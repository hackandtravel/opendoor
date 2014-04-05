/** @jsx React.DOM */
define([
  'react',
  'pages',
  'view/page/header/HeaderView',
  'controller/controller',
], function (React, PAGE, HeaderView, controller) {
  return React.createClass({
    getInitialState: function () {
      return {
        status: 'OpenDoor',
        loading: false,
        disabled: false
      }
    },

    onOpenDoorClicked: function () {
      var i = this.refs.selectDoor.getDOMNode().selectedIndex;
      var door = this.props.doors[i];

      controller.openDoor(door, controller.getToken(door.deviceid), {
        setStatus: this.setStatus,
        setLoading: this.setLoading,
        setDisabled: this.setDisabled
      });
    },

    setStatus: function(status) {
      if (status === null) {
        status = this.getInitialState().status
      }

      this.setState({
        status: status
      })
    },

    setLoading: function (loading) {
      this.setState({
        loading: loading
      });
    },

    setDisabled: function (disabled) {
      this.setState({
        disabled: disabled
      })
    },

    render: function () {
      var cx = React.addons.classSet;
      var classes = cx({
        'page': true,
        'page-left': this.props.page !== PAGE.HOME,
        'page-middle': this.props.page === PAGE.HOME,
        'page-right': false
      });

      var doors = this.props.doors.map(function (door) {
        return (
          React.DOM.option( {value:door.number, 'data-deviceid':door.deviceid}, door.name)
          );
      });

      var buttonClasses = cx({
        'btn': true,
        'btn-primary': true,
        'disabled': this.props.doors.length === 0 || this.state.disabled
      });

      var buttonIconClasses = cx({
        'fa': true,
        'fa-lock': !this.state.disabled,
        'fa-unlock': this.state.disabled
      });

      var style = { margin: 7 };
      return (
        React.DOM.div( {id:"page-open-door", className:classes}, 
          HeaderView( {loading:this.state.loading, header:this.state.status}, 
            React.DOM.a( {id:"btn-new", className:"btn btn-default open-door-page pull-right", style:style, href:"/#/login"}, 
              React.DOM.span( {className:"glyphicon glyphicon-plus"})
            )
          ),
          React.DOM.div( {className:"row"}, 
            React.DOM.div( {className:"col-md-12"}, 
              React.DOM.div(null , 
                React.DOM.label( {htmlFor:"door-select"}, "Choose a door:"),
                React.DOM.select( {ref:"selectDoor", id:"select-door", className:"form-control"}, 
                doors
                )
              )
            ),
            React.DOM.button( {id:"btn-open-door", type:"button", className:buttonClasses, onClick:this.onOpenDoorClicked}, 
              React.DOM.span( {className:buttonIconClasses})
            )
          )
        ));
    }
  });
});