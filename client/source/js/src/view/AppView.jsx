define([
  'react',
  'director',
  'pages',
  'view/page/HomeView',
  'view/page/NewDeviceView',
  'controller/controller'
], function (React, Router, PAGE, HomeView, NewDeviceView, controller) {
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

    componentDidMount: function () {
      this.router = Router({
        '/': this.setPage.bind(this, PAGE.HOME),
        '/home': this.setPage.bind(this, PAGE.HOME),
        '/login': this.setPage.bind(this, PAGE.LOGIN)
      });
      this.router.init('/');

      var init = this.state.doors.length > 0 ? PAGE.HOME : PAGE.LOGIN;
      this.router.setRoute('/' + init)
    },

    addDevice: function (device) {
      this.setState({
        doors: this.state.doors.concat(device.doors)
      })
    },

    setRouteHome: function () {
      this.router.setRoute('/')
    },

    render: function () {
      console.log('AppView: render');
      return (
        <div id='app'>
          <HomeView
          page={this.state.page}
          doors={this.state.doors}
          />
          <NewDeviceView
          page={this.state.page}
          setRouteHome={this.setRouteHome}
          addDevice={this.addDevice}
          />
        </div>);
    }
  });
});