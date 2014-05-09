define([
  'react',
  'controller/controller',
  'model/Door'
], function (React, controller, Door) {
  return React.createClass({
    propTypes: {
      door: React.PropTypes.instanceOf(Door).isRequired,
      setStatus: React.PropTypes.func,
      setLoading: React.PropTypes.func
    },

    getInitialState: function () {
      return {
        disabled: false,
        unlocked: false
      }
    },

    onClick: function () {
      if (!this.state.disabled) {
        controller.openDoor(this.props.door, controller.getToken(this.props.door.deviceid), {
          setStatus: this.props.setStatus,
          setLoading: this.props.setLoading,
          setDisabled: this.setDisabled,
          setUnlocked: this.setUnlocked
        });
      }
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
    
    transition: function(value) {
      return {
        WebkitTransition: '-webkit-' + value,
        transition: value
      }
    },

    render: function () {
      var cx = React.addons.classSet;
      
      var move;
      var style = this.transition('');
      if (this.state.unlocked) {
        move = 'move';
        style = this.transition('transform ' + (this.props.door.buzztime) + 'ms linear');
      }
      
      var dis;
      if (this.state.disabled) {
        dis = 'disabled';
      }
      
      var iconClasses = cx({
        'fa': true,
        'fa-unlock': this.state.unlocked,
        'fa-lock': !this.state.unlocked
      });
      
      return (
        <a className={"button button-primary right " + dis} onClick={this.onClick}>
          <span className={"hour-glass " + move} style={style} />
          <span className={iconClasses} />
        </a>);
    }
  })
});