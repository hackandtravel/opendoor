define([
  'react',
  'pages',
  'view/component/HeaderView',
  'view/component/KeyItem',
  'controller/controller'
], function (React, PAGE, Header, KeyItem, controller) {
  return React.createClass({
    propTypes: {
      onKeyClicked: React.PropTypes.func
    },

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
      var device = this.props.device;

      var keyGroup = _.groupBy(device.keys, function (key) {
        return key.valid;
      });

      var keyItemsActive;
      if (keyGroup.hasOwnProperty('true')) {
        keyItemsActive = keyGroup['true'].map(function (key) {
          return <KeyItem key={key.key} keykey={key} deviceid={door.deviceid} />;
        }, this);
      }

      var keyItemsDisabled;
      if (keyGroup.hasOwnProperty('false')) {
        keyItemsDisabled = keyGroup['false'].map(function (key) {
          return <KeyItem key={key.key} keykey={key} deviceid={door.deviceid} />;
        }, this);
      }

      var header = <div className="center">{door.name}</div>;

      var footer;
      if (this.props.door.masterToken) {
        footer =
          <footer>
            <a
            className="button-full button-primary"
            href={['#', PAGE.DOOR, door.deviceid, PAGE.NEW_KEY].join('/')}
            >
            New Key
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
          <div className="list bottom">
            {keyItemsActive}
            {keyItemsDisabled}
          </div>
          {footer}
        </div>
        );
    }
  });
});