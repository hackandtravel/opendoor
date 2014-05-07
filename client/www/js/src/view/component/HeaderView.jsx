define([
  'react'
], function (React) {
  return React.createClass({
    render: function () {

      var header;
      if (!this.props.loading) {
        header = this.props.header;
      } else {
        header = <div className="rest"><div className="loading"/></div>;
      }

      return (
        <header id="header" role="navigation">
          {this.props.children}
          {header}
        </header>);
    }
  });
});
