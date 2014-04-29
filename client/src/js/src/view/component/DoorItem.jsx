define([
  'react',
  'model/Door'
], function (React, Door) {
  React.createClass({
    propTypes: {
      door: React.PropTypes.instanceOf(Door).isRequired,
      onClick: React.PropTypes.func.isRequired,
      onOpenDoorClick: React.PropTypes.func.isRequired
    },
    render: function () {
      return (
        <a className="list-group-item">
          <h4 className="list-group-item-heading">List group item heading</h4>
          <p className="list-group-item-text"></p>
        </a>
        );
    }
  });
});
