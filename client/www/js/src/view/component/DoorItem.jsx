define([
  'react',
  'model/Door',
  'view/component/UnlockButton',
  'pages'
], function (React, Door, UnlockButton, PAGE) {
  return React.createClass({
    propTypes: {
      door: React.PropTypes.instanceOf(Door).isRequired,
      onClick: React.PropTypes.func.isRequired
    },
    render: function () {
      //console.log(this.props.door);
      var door = this.props.door;
      return (
        <div className="list-item door">
          <UnlockButton 
          door={this.props.door}
          setStatus={this.props.setStatus}
          setLoading={this.props.setLoading}
          />
          <a className="button-normal rest foo" href={["#", PAGE.DOOR, door.deviceid].join('/')}>
            <span>{door.deviceName}</span>
            <span>/</span>
            <span>{door.name}</span>
          </a>
        </div>);
    }
  });
});
