define([
  'react',
  'model/Door'
], function (React, Door) {
  return React.createClass({
    propTypes: {
      door: React.PropTypes.instanceOf(Door).isRequired,
      onClick: React.PropTypes.func.isRequired,
      onOpenDoorClicked: React.PropTypes.func.isRequired
    },
    render: function () {
      console.log(this.props.door);
      return (
        <div className="list-item">
          <a className="button button-primary right" onClick={this.props.onOpenDoorClicked}>
            <span className="fa fa-lock"/>
          </a>
          <a className="button-full button-normal center">
          </a>
        </div>);
    }
  });
});
