define([
  'react'
], function (React) {
  return React.createClass({
    render: function () {

      var header;
      if (!this.props.loading) {
        header = this.props.header;
      } else {
        header = <div className="loading"/>;
      }

      return (
        <nav id="header" className="navbar navbar-default navbar-fixed-top" role="navigation">
          <a id="new-door-brand" className="navbar-brand new-door-page">{header}</a>
          {this.props.children}
        </nav>);
    }
  });
});
