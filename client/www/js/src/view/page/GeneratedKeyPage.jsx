define([
  'react',
  'pages'
], function (React, PAGE) {
  return React.createClass({
    render: function () {
      var cx = React.addons.classSet;
      var classes = cx({
        'page': true,
        'page-left': false,
        'page-middle': this.props.page === PAGE.GENERATED_KEY,
        'page-right': this.props.page !== PAGE.GENERATED_KEY
      });

      return (
        <div className={classes} >
        </div>
        );
    }
  });
});