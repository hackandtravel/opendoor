define([
  'react',
  'pages',
  'view/page/header/HeaderView',
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
      }
    },

    /**
     * When a door in the list is clicked
     */
    onClick: function () {

    },

    /**
     * When a door in the list should be opened
     */
    onOpenDoorClicked: function (door) {
      if (!this.state.disabled) {
        controller.openDoor(door, controller.getToken(door.deviceid), {
          setStatus: this.setStatus,
          setLoading: this.setLoading,
          setDisabled: this.setDisabled,
          setUnlocked: this.setUnlocked
        });
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

    setDisabled: function (disabled) {
      this.setState({
        disabled: disabled
      })
    },

    setUnlocked: function (unlocked) {
      this.setState({
        unlocked: unlocked
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

      var s = {textAlign: 'center'};
      var doors = (this.props.doors.length > 0) ? (
        this.props.doors.map(function (door) {
          return (
            <DoorItem
            door={door}
            onClick={this.onClick.bind(this, door)}
            onOpenDoorClicked={this.onOpenDoorClicked.bind(this, door)}
            />);
        })) : (
        <span className="list-group-item" style={s}>
          <h4 className="list-group-item-heading">No Keys</h4>
          <p className="list-group-item-text">
            You don't have any valid keys at the moment
          </p>
          <br/>
          <p className="list-group-item-text">
            <a href="#/login" className="btn btn-lg btn-primary">Add key</a>
          </p>
        </span>
        );

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

      var style = { margin: 7 };
      return (
        <div id='page-open-door' className={classes}>
          <HeaderView loading={this.state.loading} header={this.state.status}>
            <a className="open-door-page button left">
            </a>
            <span class="middle">OpenDoor</span>
            <a id="btn-new" className="open-door-page button right" href={'#/' + PAGE.LOGIN}>
              <span className="glyphicon glyphicon-plus"></span>
            </a>
          </HeaderView>
          <div className="list-group">
            {doors}
          </div>
        </div>);
    }
  });
});