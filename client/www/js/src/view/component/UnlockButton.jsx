define([
  'react',
  'controller/controller'
], function (React, controller) {
  return React.createClass({
    propTypes: {
      onClick: React.PropTypes.func.isRequired,
      setStatus: React.PropTypes.func,
      setLoading: React.PropTypes.func
    },

    getInitialState: function () {
      return {
        disabled: false,
        unlocked: false
      }
    },

    onClick: function (e) {
      if (!this.state.disabled) {
        controller.openDoor(door, controller.getToken(door.deviceid), {
          setStatus: this.props.setStatus,
          setLoading: this.props.setLoading,
          setDisabled: this.setDisabled,
          setUnlocked: this.setUnlocked
        });
      }
    },

    setDisabled: function () {

    },

    setUnlocked: function () {

    },

    render: function () {
      var cx = React.addons.classSet;
      var classes = cx({
        'muted': this.state.disabled
      });
      var iconClasses = cx({
        'fa': true,
        'fa-unlock': this.state.unlocked,
        'fa-lock': !this.state.unlocked
      });
      return (
        <a className="button button-primary right" onClick={this.props.onClick}>
          <span className={iconClasses} />
        </a>);
    }
  })
});