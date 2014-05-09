define([
  'react',
  'pages',
  'view/component/HeaderView',
  'view/component/DoorItem',
  'controller/controller',
], function (React, PAGE, HeaderView, DoorItem, controller) {
  return React.createClass({
    getInitialState: function () {
      return {
        status: 'OpenDoor',
        loading: false,
        disabled: false,
        unlocked: false
      };
    },

    onOpenDoorClicked: function (door) {
      return function (e) {
        if (!this.state.disabled) {
          controller.openDoor(door, controller.getToken(door.deviceid), {
            setStatus: this.setStatus,
            setLoading: this.setLoading,
            setDisabled: this.setDisabled,
            setUnlocked: this.setUnlocked
          });
        }
      }.bind(this);
    },

    setStatus: function (status) {
      if (status === null) {
        status = this.getInitialState().status
      }

      this.setState({
        status: status
      });
    },

    setLoading: function (loading) {
      this.setState({
        loading: loading
      });
    },

    setDisabled: function (disabled) {
      this.setState({
        disabled: disabled
      });
    },

    setUnlocked: function (unlocked) {
      this.setState({
        unlocked: unlocked
      });
    },

    render: function () {
      var cx = React.addons.classSet;
      var classes = cx({
        'page': true,
        'page-left': this.props.page !== PAGE.HOME,
        'page-middle': this.props.page === PAGE.HOME,
        'page-right': false
      });

      var doors = (this.props.doors.length > 0) ? (
        this.props.doors.map(function (door) {
          return (
            <DoorItem
            key={door.id}
            door={door}
            onClick={this.props.onDoorClicked(door)}
            onOpenDoorClicked={this.onOpenDoorClicked(door)}
            setStatus={this.setStatus}
            setLoading={this.setLoading}
            />);
        }, this)) : ([
        <div className="helper">
          <h4>No doors to open</h4>
          <hr/>
          <p>There are currently no valid keys in your keychain.</p>
        </div>,
        <div className="list-item">
          <a className="button-full button-normal" href={"#/" + PAGE.LOGIN}>
          Add Key
          </a>
        </div>]);

      /*
       var buttonClasses = cx({
       'btn': true,
       'btn-primary': true,
       'disabled': this.props.doors.length === 0 || this.state.disabled
       });

       var buttonIconClasses = cx({
       'fa': true,
       'fa-lock': !this.state.unlocked,
       'fa-unlock': this.state.unlocked
       });
       */

      return (
        <div id='page-open-door' className={classes}>
          <HeaderView loading={this.state.loading} header={this.state.status}>
            <a className="open-door-page button button-normal left">
              <span className="glyphicon glyphicon-align-justify" />
            </a>
            <a id="btn-new" className="open-door-page button button-normal right" href={'#/' + PAGE.LOGIN}>
              <span className="glyphicon glyphicon-plus"></span>
            </a>
          </HeaderView>
          <div className="list">
            {doors}
          </div>
        </div>);
    }
  });
});