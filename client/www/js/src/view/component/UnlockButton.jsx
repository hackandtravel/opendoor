define([
  'react'
], function (React) {
  return React.createClass({
    propTypes: {
      onClick: React.PropTypes.func.isRequired
    },
    
    getInitialState: function () {
      return {}
    },
    
    render: function () {
      // TODO
      return (
        <a className="button button-primary right" onClick={this.props.onClick}>
          <span className="fa fa-lock"/>
        </a>);
    }
  })
});