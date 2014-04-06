/** @jsx React.DOM */
define([
  'react',
  'pages',
  'view/page/header/HeaderView',
  'controller/controller',
  'evil-things'
], function (React, PAGE, HeaderView, controller) {
  return React.createClass({
    getInitialState: function () {
      return {
        status: 'Login to a Device',
        hasError: false,
        loading: false
      }
    },

    onLoginClicked: function () {
      var inputDeviceId = this.refs.inputDeviceId.getDOMNode();
      var inputKey = this.refs.inputKey.getDOMNode();

      var deviceId = inputDeviceId.value.trim();
      var key = inputKey.value;

      controller.login(deviceId, key, {
        setLoading: this.setLoading,
        setStatus: this.setStatus,
        setError: this.setError,
        setRouteHome: this.props.route.bind(this, PAGE.HOME),
        addDevice: this.props.addDevice
      });

      inputDeviceId.value = '';
      inputKey.value = '';
    },

    setStatus: function (status) {
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

    setError: function (hasError) {
      this.setState({
        hasError: hasError
      })
    },

    render: function () {
      var cx = React.addons.classSet;
      var classes = cx({
        'page': true,
        'page-left': false,
        'page-middle': this.props.page === PAGE.LOGIN,
        'page-right': this.props.page !== PAGE.LOGIN
      });

      var formGroupClasses = cx({
        'form-group': true,
        'door-form-group': true,
        'has-error': this.state.hasError
      });

      var style = { margin: 7 };
      return (
        React.DOM.div( {id:"page-new-door", className:classes}, 
          HeaderView( {loading:this.state.loading, header:this.state.status}, 
            React.DOM.a( {id:"back-btn", className:"btn btn-default new-door-page pull-left", style:style, onClick:this.props.route.bind(this, PAGE.HOME)}, 
              React.DOM.span( {className:"glyphicon glyphicon-chevron-left"})
            ),
            React.DOM.a( {id:"login-btn", className:"btn btn-primary new-door-page pull-right", style:style, onClick:this.onLoginClicked}, "Add")
          ),
          React.DOM.div( {className:"row"}, 
            React.DOM.div( {className:"col-md-12"}, 
              React.DOM.div( {className:"new-door-page"}, 
                React.DOM.div( {className:formGroupClasses}, 
                  React.DOM.label( {htmlFor:"door-select"}, "Device ID:"),
                  React.DOM.input( {ref:"inputDeviceId", id:"door-url", type:"text", className:"form-control"} )
                ),
                React.DOM.div( {className:formGroupClasses}, 
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
