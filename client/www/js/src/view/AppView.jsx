/** @jsx React.DOM */

define([
  'react',
  'director',
  'pages',
  'view/page/HomePage',
  'view/page/NewDevicePage',
  'view/page/DevicePage',
  'view/page/NewKeyPage',
  'controller/controller'
], function (React, Router, PAGE, HomePage, NewDevicePage, DevicePage, NewKeyPage, controller) {
  return React.createClass({
    getInitialState: function () {
      return {
        page: PAGE.HOME,
        doors: controller.getDoors(),
        selectedDoor: null, // depricated
        selectedDevice: null
      };
    },

    setPage: function (page) {
      this.setState({
        page: page
      });
    },

    route: function (href) {
      this.router.setRoute(href);
    },

    componentWillMount: function () {
      controller.init()
    },

    componentDidMount: function () {
      this.router = Router({
        '': this.setPage.bind(this, PAGE.HOME),
        'home': this.setPage.bind(this, PAGE.HOME),
        'login': this.setPage.bind(this, PAGE.LOGIN),
        'device/:id/generate': function (deviceid) {
          var door = this.state.doors.find(function (door) {
            return deviceid === door.deviceid && Number(1) === door.number
          });

          if (door != null) {
            this.setState({
              page: PAGE.NEW_KEY,
              selectedDoor: door,
              selectedDevice: deviceid
            });
          }
        }.bind(this),
        'device/:id': function (deviceid) {
          var door = this.state.doors.find(function (door) {
            return deviceid === door.deviceid && Number(1) === door.number
          });

          if (door != null) {
            this.setState({
              page: PAGE.DOOR,
              selectedDoor: door,
              selectedDevice: deviceid
            });
          }
        }.bind(this)
      });
      this.router.init('');

      var init = this.state.doors.length > 0 ? PAGE.HOME : PAGE.LOGIN;
      this.router.init(init)
    },

    addDevice: function (device) {
      this.setState({
        doors: this.state.doors.concat(device.doors)
      })
    },

    setRouteHome: function () {
      this.router.setRoute('/')
    },

    onDoorClicked: function (door) {
      return function (e) {
        this.setState({
          page: PAGE.DOOR,
          selectedDoor: door
        });
      }.bind(this);
    },

    render: function () {

      var device, page;
      switch (this.state.page) {
        case PAGE.DOOR:
          device = controller.getDevice(this.state.selectedDevice);
          page =
            <DevicePage
            page={this.state.page}
            device={device}
            door={this.state.selectedDoor}
            />;
          break;
        
        case PAGE.LOGIN:
          page =
            <NewDevicePage
            page={this.state.page}
            addDevice={this.addDevice}
            setPage={this.setPage}
            route={this.route}
            />;
          break;
        
        case PAGE.NEW_KEY:
          device = controller.getDevice(this.state.selectedDevice);
          page =
            <NewKeyPage
            page={this.state.page}
            door={this.state.selectedDoor}
            />;
          break;
      }
      
      return (
        <div id='app'>
          <HomePage
          page={this.state.page}
          doors={this.state.doors}
          route={this.route}
          onDoorClicked={this.onDoorClicked}
          />
          {page}
        </div>);
    }
  });
});