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
        'list-item': true,
        'has-error': this.state.hasError
      });

      return (
        <div id='page-new-door' className={classes}>
          <HeaderView loading={this.state.loading} header={this.state.status}>
            <a id="back-btn" className="new-door-page button left" href={'#/' + PAGE.HOME}>
              <span className="glyphicon glyphicon-chevron-left"></span>
            </a>
            <span className="middle">Add Device</span>
            <a className="button right"></a>
          </HeaderView>
          <div className="list">
            <div className={formGroupClasses}>
              <input ref="inputDeviceId" id="door-url" type="text" placeholder="Device Id" />
            </div>
            <div className={formGroupClasses}>
              <input ref="inputKey" id="passphrase" type="text" placeholder="Key" />
            </div>
          </div>
          <footer>
            <a className="button-full">Add</a>
          </footer>
        </div>);
    }
  });
});
