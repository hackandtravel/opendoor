define([
  'react',
  'model/Key',
  'pages'
], function (React, Key, PAGE) {
  return React.createClass({
    propTypes: {
      keykey: React.PropTypes.instanceOf(Key).isRequired
    },

    onClick: function() {
    },

    render: function () {
      var key = this.props.keykey;

      return (
        <div className="list-item key">
          <span className="button left muted">
            <span className="fa fa-key"/>
          </span>
          <a className="button-normal pl center">
            <span>{key.name}</span>
          </a>
        </div>);
    }
  });
});
