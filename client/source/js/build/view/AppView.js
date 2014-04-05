/** @jsx React.DOM */
define([
  'react',
  'director',
  'pages',
  'view/page/HomeView',
  'view/page/NewDeviceView',
  'controller/controller'
], function(React, Router, PAGE, HomeView, NewDeviceView, controller) {
  return React.createClass({
    getInitialState: function() {
      return {
        page: PAGE.HOME
      };
    },

    setLoading: function(on) {
      this.setState({
        loading: on
      });
    },

    componentDidMount: function () {
      var router = Router({
        '/': function() { this.setState({page: PAGE.HOME})}.bind(this),
        '/login': function() { this.setState({page: PAGE.LOGIN})}.bind(this)
      });
      router.init('/');
    },

    render: function() {
      return (
        React.DOM.div( {id:"app"}, 
          HomeView(
            {page:this.state.page,
            doors:[]}
          ),
          NewDeviceView(
            {page:this.state.page,
            setLoading:this.setLoading,
            onLoginClicked:controller.login}
          )
        ));
    }
  });
});