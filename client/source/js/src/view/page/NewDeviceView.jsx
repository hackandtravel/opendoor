define([
  'react',
  'pages',
  'view/page/header/HeaderView',
  'controller/controller',
  'evil-things'
], function (React, PAGE, HeaderView, controller) {
  return React.createClass({
    getInitialState: function() {
      return {
        status: 'Login to a Device',
        hasError: false,
        loading: false
      }
    },

    onLoginClicked: function() {
      var inputDeviceId = this.refs.inputDeviceId.getDOMNode();
      var inputKey = this.refs.inputKey.getDOMNode();

      var deviceId = inputDeviceId.value.trim();
      var key = inputKey.value;

      controller.login(deviceId, key, {
        setLoading: this.setLoading,
        setStatus: this.setStatus,
        setError: this.setError,
        setRouteHome: this.props.setRouteHome,
        addDevice: this.props.addDevice
      });

      inputDeviceId.value = '';
      inputKey.value = '';
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
        <div id='page-new-door' className={classes}>
          <HeaderView loading={this.state.loading} header={this.state.status}>
            <a id="back-btn" className="btn btn-default new-door-page pull-left" style={style} href="/#/home">
              <span className="glyphicon glyphicon-chevron-left"></span>
            </a>
            <a id="login-btn" className="btn btn-primary new-door-page pull-right" style={style} onClick={this.onLoginClicked}>Add</a>
          </HeaderView>
          <div className="row">
            <div className="col-md-12">
              <div className="new-door-page">
                <div className={formGroupClasses}>
                  <label htmlFor="door-select">Device ID:</label>
                  <input ref="inputDeviceId" id="door-url" type="text" className="form-control" />
                </div>
                <div className={formGroupClasses}>
                  <label htmlFor="passphrase">Key:</label>
                  <input ref="inputKey" id="passphrase" type="password" className="form-control" />
                </div>
              </div>
            </div>
          </div>
        </div>);
    }
  });
});
