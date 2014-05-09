define([
  'react',
  'pages',
  'view/component/HeaderView',
  'controller/controller'
], function (React, PAGE, Header, controller) {
  return React.createClass({
    componentDidMount: function () {
      controller.updateDevice(this.props.device, this.props.forceUpdate);
    },
    
    render: function () {
      var cx = React.addons.classSet;
      var classes = cx({
        'page': true,
        'page-left': false,
        'page-middle': this.props.page === PAGE.DOOR,
        'page-right': this.props.page !== PAGE.DOOR
      });

      var door = this.props.door;

      var header = <div className="center">{door.name}</div>;

      var footer;
      if (this.props.door.masterToken) {
        footer =
          <footer>
            <a
            className="button-full button-primary"
            href={['#', PAGE.DOOR, door.deviceid, PAGE.NEW_KEY].join('/')}
            >
            Generate Key
            </a>
          </footer>;
      }

      return (
        <div className={classes}>
          <Header loading={false} header={header}>
            <a id="back-btn" className="new-door-page button button-normal left" href={'#/' + PAGE.HOME}>
              <span className="glyphicon glyphicon-chevron-left"></span>
            </a>
          </Header>
          {footer}
        </div>
        );
    }
  });
});