/** @jsx React.DOM */

define([
  'react',
  'director',
  'pages',
  'view/page/HomePage',
  'view/page/NewDevicePage',
  'view/page/DoorPage',
  'view/page/NewKeyPage',
  'controller/controller'
], function (React, Router, PAGE, HomePage, NewDevicePage, DoorPage, NewKeyPage, controller) {
  return React.createClass({
    getInitialState: function () {
      return {
        page: PAGE.HOME,
        doors: controller.getDoors()
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
        'door/:id/:num/generate': function (deviceid, num) {
          var door = this.state.doors.find(function (door) {
            return deviceid === door.deviceid && Number(num) === door.number
          });
          if (door != null) {
            this.setState({
              page: PAGE.NEW_KEY,
              selectedDoor: door
            });
          }
        }.bind(this),
        'door/:id/:num': function (deviceid, num) {
          var door = this.state.doors.find(function (door) {
            return deviceid === door.deviceid && Number(num) === door.number
          });
          if (door != null) {
            this.setState({
              page: PAGE.DOOR,
              selectedDoor: door
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
      var page;
      switch (this.state.page) {
        case PAGE.DOOR:
          page =
            <DoorPage
            page={this.state.page}
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