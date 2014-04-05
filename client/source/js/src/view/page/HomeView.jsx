define([
  'react',
  'pages'
], function (React, PAGE) {
  return React.createClass({
    render: function () {
      var cx = React.addons.classSet;
      var classes = cx({
        'page': true,
        'page-left': this.props.page !== PAGE.HOME,
        'page-middle': this.props.page === PAGE.HOME,
        'page-right': false
      });

      var doors = this.props.doors.map(function(door) {
        return (
          <option value={door.number} data-deviceid={door.deviceId}>{door.name}</option>
          );
      });

      var style = { margin: 7 };
      return (
        <div id='page-open-door' className={classes}>
          <nav id="header" className="navbar navbar-default navbar-fixed-top" role="navigation">
            <a id="open-door-brand" className="navbar-brand open-door-page">OpenDoor</a>
            <a id="btn-new" className="btn btn-default open-door-page pull-right" style={style} href="/#/login">
              <span className="glyphicon glyphicon-plus"></span>
            </a>
          </nav>
          <div className="row">
            <div className="col-md-12">
              <div >
                <label htmlFor="door-select">Choose a door:</label>
                <select id="select-door" className="form-control">
                {doors}
                </select>
              </div>
            </div>
            <button id="btn-open-door" type="button" className="btn btn-default {{disabled}}">
              <span className="glyphicon glyphicon-lock"></span>
            </button>
          </div>
        </div>);
    }
  });
});