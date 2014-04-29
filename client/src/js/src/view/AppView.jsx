/** @jsx React.DOM */

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

    setPage: function(page) {
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
        'login': this.setPage.bind(this, PAGE.LOGIN)
      });
      this.router.init('');

      var init = this.state.doors.length > 0 ? PAGE.HOME : PAGE.LOGIN;
      this.router.setRoute(init)
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
          route={this.route}
          />
          <NewDeviceView
          page={this.state.page}
          addDevice={this.addDevice}
          setPage={this.setPage}
          route={this.route}
          />
        </div>);
    }
  });
});