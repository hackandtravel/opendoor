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
          <div className="spinner"/>
          );
      }

      var style = { margin: 7 };
      return (
        <div id='page-new-door' className={classes}>
          <nav id="header" className="navbar navbar-default navbar-fixed-top" role="navigation">
            <a id="new-door-brand" className="navbar-brand new-door-page">{header}</a>
            <a id="back-btn" className="btn btn-default new-door-page pull-left" style={style} href="/#/">
              <span className="glyphicon glyphicon-chevron-left"></span>
            </a>
            <a id="login-btn" className="btn btn-primary new-door-page pull-right" style={style} onClick={this.onLoginClicked}>Add</a>
          </nav>
          <div className="row">
            <div className="col-md-12">
              <div className="new-door-page">
                <div className="door-form-group form-group">
                  <label htmlFor="door-select">Device ID:</label>
                  <input ref="inputDeviceId" id="door-url" type="text" className="form-control" />
                </div>
                <div className="pass-form-group form-group">
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
