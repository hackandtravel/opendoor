define([
  'underscore',
  'react',
  'pages',
  'view/component/HeaderView',
  'model/Device',
  'model/Key',
  'controller/controller'
], function (_, React, PAGE, HeaderView, Device, Key, controller) {
  return React.createClass({
    propTypes: {
      device: React.PropTypes.instanceOf(Device),
      keykey: React.PropTypes.instanceOf(Key),
      status: React.PropTypes.string
    },

    deleteKey: function () {
      var nextPage = [PAGE.DOOR, this.props.device.deviceid];
      controller.deleteKey(this.props.device, {key: this.props.keykey.key}, {
        setLoading: this.setLoading,
        setStatus: this.setStatus,
        changePage: this.props.setRoute.bind(this, nextPage.join('/'))
      });
    },

    restoreKey: function () {
      var nextPage = [PAGE.DOOR, this.props.device.deviceid];
      controller.restoreKey(this.props.device, this.props.keykey, {
        setLoading: this.setLoading,
        setStatus: this.setStatus,
        changePage: this.props.setRoute.bind(this, nextPage.join('/'))
      });
    },

    getInitialState: function () {
      return {
        status: this.props.status,
        hasError: [],
        loading: false
      }
    },

    setStatus: function (status) {
      if (status === null) {
        status = this.props.status
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

    render: function () {
      if (this.props.keykey) {
        var cx = React.addons.classSet;
        var classes = cx({
          'page': true,
          'page-left': false,
          'page-middle': true,
          'page-right': false
        });

        var status = <div className="center">{this.state.status}</div>;

        var dangerZone, button;
        if (this.props.keykey.valid) {
          dangerZone =
            <div className="helper danger">
              <h4>Revoke Access</h4>
              <hr/>
              <p>This will revoke access via this key from all devices that have it in their key chain.</p>
            </div>;
          button =
            <a
            className="button-full button-danger"
            onClick={this.deleteKey}>
            Revoke Access
            </a>;
        } else {
          dangerZone =
            <div className="helper">
              <h4>Restore Access</h4>
              <hr/>
              <p>This will restore access to a previously disabled key.</p>
            </div>;
          button =
            <a
            className="button-full button-primary"
            onClick={this.restoreKey}>
            Restore Access
            </a>;
        }

        return (
          <div id='page-new-door' className={classes}>
            <HeaderView loading={this.state.loading} header={status}>
              <a
              id="back-btn"
              className="new-door-page button button-normal left"
              href={['#', PAGE.DOOR, this.props.device.deviceid].join('/')}
              >
                <span className="glyphicon glyphicon-chevron-left"></span>
              </a>
            </HeaderView>
            <div className="list bottom">
              {dangerZone}
            </div>
            <footer>
              {button}
            </footer>
          </div>
          );
      }
    }
  });
});
