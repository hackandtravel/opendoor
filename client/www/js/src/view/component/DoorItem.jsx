define([
  'react',
  'model/Door',
  'pages'
], function (React, Door, PAGE) {
  return React.createClass({
    propTypes: {
      door: React.PropTypes.instanceOf(Door).isRequired,
      onClick: React.PropTypes.func.isRequired,
      onOpenDoorClicked: React.PropTypes.func.isRequired
    },
    render: function () {
      //console.log(this.props.door);
      var door = this.props.door;
      return (
        <div className="list-item door">
          <a className="button button-primary right" onClick={this.props.onOpenDoorClicked}>
            <span className="fa fa-lock"/>
          </a>
          <a className="button-normal rest foo" href={["#", PAGE.DOOR, door.deviceid, door.number].join('/')}>
            <span>{door.deviceName}</span>
            <span>/</span>
            <span>{door.name}</span>
          </a>
        </div>);
    }
  });
});
