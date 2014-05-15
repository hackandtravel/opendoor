define([
  'react',
  'pages',
  'view/component/HeaderView',
  'view/component/InputField',
  'controller/controller',
  'evil-things'
], function (React, PAGE, HeaderView, InputField, controller) {
  return React.createClass({
    getInitialState: function () {
      return {
        status: 'Add Key',
        hasError: false,
        loading: false,
        inputAll: null
      }
    },

    onLoginClicked: function () {
      var inputAll = this.refs.inputAll.state.value;

      if (inputAll && inputAll.length > 0 && inputAll.indexOf(':') > -1) {
        var deviceId = inputAll.trim().split(':')[0];
        var key = inputAll.trim().split(':')[1];

        controller.login(deviceId, key, {
          setLoading: this.setLoading,
          setStatus: this.setStatus,
          setError: this.setError,
          setRouteHome: this.props.setRoute.bind(this, PAGE.HOME),
          addDevice: this.props.addDevice
        });
      } else {
        this.setState({
          hasError: true
        })
      }
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

    handleChange: function (key) {
      return function (e) {
        var obj = {};
        obj[key] = e.target.value;
        this.setState(obj);
      }.bind(this);
    },

    render: function () {
      var cx = React.addons.classSet;
      var classes = cx({
        'page': true,
        'page-left': false,
        'page-middle': this.props.page === PAGE.LOGIN,
        'page-right': this.props.page !== PAGE.LOGIN
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
            <InputField
            ref="inputAll"
            placeholder="Key"
            helper={<p>Enter a key that you have been provided with.</p>}
            hasError={this.state.hasError}
            type="text"
            tabIndex={1}
            />
            <div className="divider" />
          </div>
          <footer>
            <a className="button-full button-primary" onClick={this.onLoginClicked}>Add</a>
          </footer>
        </div>);
    }
  });
});
