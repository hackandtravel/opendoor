/** @jsx React.DOM */

define([
  'react',
  'director',
  'pages',
  'view/page/HomePage',
  'view/page/NewDevicePage',
  'view/page/DevicePage',
  'view/page/NewKeyPage',
  'view/page/DangerZone',
  'view/page/GeneratedKeyPage',
  'controller/controller'
], function (React, Router, PAGE, HomePage, NewDevicePage, DevicePage, NewKeyPage, DangerZone, GeneratedKeyPage, controller) {
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

    setRoute: function (href) {
      this.router.setRoute(href);
    },

    componentWillMount: function () {
      controller.init()
    },

    routeDeviceNewKey: function (deviceid) {
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
    },

    routeDeviceEditKey: function (deviceid, keyId) {
      var door = this.state.doors.find(function (door) {
        return deviceid === door.deviceid && Number(1) === door.number
      });

      if (door != null) {
        this.setState({
          page: PAGE.EDIT_KEY,
          selectedDevice: deviceid,
          selectedKey: keyId
        });
      }
    },

    routeDeviceDisableKey: function (deviceid, keyId) {
      var door = this.state.doors.find(function (door) {
        return deviceid === door.deviceid && Number(1) === door.number
      });

      if (door != null) {
        this.setState({
          page: PAGE.DISABLE_KEY,
          selectedDevice: deviceid,
          selectedKey: keyId
        });
      }
    },

    routeDevice: function (deviceid) {
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
    },

    componentDidMount: function () {
      this.router = Router({
        '': this.setPage.bind(this, PAGE.HOME),
        'home': this.setPage.bind(this, PAGE.HOME),
        'login': this.setPage.bind(this, PAGE.LOGIN),
        'device/:id/new-key': this.routeDeviceNewKey,
        'device/:id/edit-key/:key': this.routeDeviceEditKey,
        'device/:id/disable-key/:key': this.routeDeviceDisableKey,
        'device/:id': this.routeDevice
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

      var device, key, page;
      switch (this.state.page) {
        case PAGE.DOOR:
          device = controller.getDevice(this.state.selectedDevice);
          page =
            <DevicePage
            page={this.state.page}
            device={device}
            door={this.state.selectedDoor}
            forceUpdate={this.forceUpdate.bind(this)}
            />;
          break;

        case PAGE.LOGIN:
          page =
            <NewDevicePage
            page={this.state.page}
            setPage={this.setPage}
            addDevice={this.addDevice}
            setRoute={this.setRoute}
            />;
          break;

        case PAGE.NEW_KEY:
          device = controller.getDevice(this.state.selectedDevice);
          page =
            <NewKeyPage
            show={true}
            status="New Key"
            page={this.state.page}
            setRoute={this.setRoute}
            device={device}
            door={this.state.selectedDoor}
            buttonText={"Generate"}
            />;
          break;

        case PAGE.EDIT_KEY:
          // TODO: selectedDevice

          device = controller.getDevice(this.state.selectedDevice);
          key = device.keys.find(function (key) {
            return key.key === this.state.selectedKey
          }, this);

          page =
            <NewKeyPage
            show={true}
            status={key.name}
            page={this.state.page}
            setRoute={this.setRoute}
            device={device}
            keykey={key}
            buttonText={"Save"}
            />;
          break;

        case PAGE.DISABLE_KEY:
          device = controller.getDevice(this.state.selectedDevice);
          key = device.keys.find(function (key) {
            return key.key === this.state.selectedKey
          }, this);

          page =
            <DangerZone
            status={key.name}
            page={this.state.page}
            setRoute={this.setRoute}
            device={device}
            keykey={key}
            />;
          break;

        case PAGE.GENERATED_KEY:
          page =
            <GeneratedKeyPage
            page={this.state.page}
            key={this.state.selectedKey}
            />;
          break;
      }

      return (
        <div id='app'>
          <HomePage
          page={this.state.page}
          doors={this.state.doors}
          route={this.setRoute}
          onDoorClicked={this.onDoorClicked}
          />
          {page}
        </div>);
    }
  });
});