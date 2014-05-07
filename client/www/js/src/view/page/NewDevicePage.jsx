define([
  'react',
  'pages',
  'view/component/HeaderView',
  'controller/controller',
  'evil-things'
], function (React, PAGE, HeaderView, controller) {
  return React.createClass({
    getInitialState: function () {
      return {
        status: 'Add Key',
        hasError: false,
        loading: false,
        inputDeviceId: '',
        inputKey: ''
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

    setField: function (key) {
      return function (e) {
        var obj = {};
        obj[key] = e.target.value;
        this.setState(obj);
      }
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

      var status = <div className="center">{this.state.status}</div>;

      return (
        <div id='page-new-door' className={classes}>
          <HeaderView loading={this.state.loading} header={status}>
            <a id="back-btn" className="new-door-page button button-normal left" href={'#/' + PAGE.HOME}>
              <span className="glyphicon glyphicon-chevron-left"></span>
            </a>
          </HeaderView>
          <div className="list">
            <div className={formGroupClasses}>
              <input
              type="text"
              ref="inputDeviceId"
              id="door-url"
              placeholder="Device Id"
              value={this.state.inputDeviceId}
              onChange={this.setField('inputDeviceId')}
              />
            </div>
            <div className={formGroupClasses}>
              <input
              ref="inputKey"
              id="passphrase"
              type="text"
              placeholder="Key"
              value={this.state.inputKey}
              onChange={this.setField('inputKey')}
              />
            </div>
          </div>
          <footer>
            <a className="button-full button-primary" onClick={this.onLoginClicked}>Add</a>
          </footer>
        </div>);
    }
  });
});
