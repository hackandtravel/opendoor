define([
  'react',
  'pages',
  'view/component/HeaderView',
], function (React, PAGE, Header) {
  return React.createClass({
    render: function () {
      var cx = React.addons.classSet;
      var classes = cx({
        'page': true,
        'page-left': false,
        'page-middle': this.props.page === PAGE.DOOR,
        'page-right': this.props.page !== PAGE.DOOR
      });
      
      var door = this.props.door;

      return (
        <div className={classes}>
          <Header loading={false} header={door.name}>
            <a id="back-btn" className="new-door-page button button-normal left" href={'#/' + PAGE.HOME}>
              <span className="glyphicon glyphicon-chevron-left"></span>
            </a>
            <span className="button right" />
          </Header>
          <footer>
            <a 
            className="button-full button-primary"
            href={['#', PAGE.DOOR, door.deviceid, door.number, PAGE.NEW_KEY].join('/')}
            >
            Generate Key
            </a>
          </footer>
        </div>
        );
    }
  });
});