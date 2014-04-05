/** @jsx React.DOM */
define([
  'react',
  'pages'
], function (React, PAGE) {
  return React.createClass({
    getInitialState: function() {
      return {
        status: 'Login to a Device'
      }
    },

    onLoginClicked: function() {
      var inputDeviceId = this.refs.inputDeviceId.getDOMNode();
      var inputKey = this.refs.inputKey.getDOMNode();

      var deviceId = inputDeviceId.value.trim();
      var key = inputKey.value;

      this.props.setLoading(true);
      this.props.onLoginClicked(deviceId, key, {
        setLoading: this.props.setLoading,
        changeStatus: this.changeStatus
      });

      inputDeviceId.value = '';
      inputKey.value = '';
    },

    changeStatus: function(status) {
      this.setState({
        status: status
      });
    },

    render: function () {
      var cx = React.addons.classSet;
      var classes = cx({
        'page': true,
        'page-left': false,
        'page-middle': this.props.page === PAGE.LOGIN,
        'page-right': this.props.page !== PAGE.LOGIN
      });

      var header;
      if (!this.props.loading) {
        header = this.state.status;
      } else {
        header = (
          React.DOM.div( {className:"spinner"})
          );
      }

      var style = { margin: 7 };
      return (
        React.DOM.div( {id:"page-new-door", className:classes}, 
          React.DOM.nav( {id:"header", className:"navbar navbar-default navbar-fixed-top", role:"navigation"}, 
            React.DOM.a( {id:"new-door-brand", className:"navbar-brand new-door-page"}, header),
            React.DOM.a( {id:"back-btn", className:"btn btn-default new-door-page pull-left", style:style, href:"/#/"}, 
              React.DOM.span( {className:"glyphicon glyphicon-chevron-left"})
            ),
            React.DOM.a( {id:"login-btn", className:"btn btn-primary new-door-page pull-right", style:style, onClick:this.onLoginClicked}, "Add")
          ),
          React.DOM.div( {className:"row"}, 
            React.DOM.div( {className:"col-md-12"}, 
              React.DOM.div( {className:"new-door-page"}, 
                React.DOM.div( {className:"door-form-group form-group"}, 
                  React.DOM.label( {htmlFor:"door-select"}, "Device ID:"),
                  React.DOM.input( {ref:"inputDeviceId", id:"door-url", type:"text", className:"form-control"} )
                ),
                React.DOM.div( {className:"pass-form-group form-group"}, 
                  React.DOM.label( {htmlFor:"passphrase"}, "Key:"),
                  React.DOM.input( {ref:"inputKey", id:"passphrase", type:"password", className:"form-control"} )
                )
              )
            )
          )
        ));
    }
  });
});
