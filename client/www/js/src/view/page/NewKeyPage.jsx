define([
  'react',
  'pages',
  'view/component/HeaderView',
  'controller/controller'
], function (React, PAGE, HeaderView, controller) {
  return React.createClass({
    generateKey: function () {
      var params = {
        name: this.state.inputName || this.defaults.name,
        expire: new Date(this.state.inputExpireDate || this.defaults.expireDate).getTime(),
        limit: this.state.inputLimit || this.defaults.limit,
        doors: [this.props.door.number]
      };
      controller.generateKey(this.props.door, params, {
        setLoading: this.setLoading,
        setStatus: this.setStatus
      });
    },
    
    defaults: {
      name: 'New Key',
      limit: 3,
      expireDate: new Date(new Date().getTime() + 1000*60*60*24*356).toISOString().slice(0,10)
    },
    
    getInitialState: function () {
      return {
        status: 'Generate Key',
        hasError: false,
        loading: false,
        inputName: null,
        inputLimit: null,
        inputExpireDate: null
      }
    },

    setStatus: function (status) {
      if (status === null) {
        status = this.getInitialState().status
      }

      this.setState({
        status: status
      })
    },

    setLoading: function (loading) {
      this.setState({
        loading: loading
      });
    },

    setError: function (hasError) {
      this.setState({
        hasError: hasError
      })
    },

    handleChange: function (key) {
      return function (e) {
        var obj = {};
        obj[key] = e.target.value;
        this.setState(obj);
      }.bind(this);
    },
    
    render: function () {
      var cx = React.addons.classSet;
      var classes = cx({
        'page': true,
        'page-left': false,
        'page-middle': this.props.page === PAGE.NEW_KEY,
        'page-right': this.props.page !== PAGE.NEW_KEY
      });

      var formGroupClasses = cx({
        'list-item': true,
        'has-error': this.state.hasError
      });

      var status = <div className="center">{this.state.status}</div>;
      
      var door = this.props.door;

      return (
        <div id='page-new-door' className={classes}>
          <HeaderView loading={this.state.loading} header={status}>
            <a 
            id="back-btn"
            className="new-door-page button button-normal left"
            href={['#', PAGE.DOOR, door.deviceid, door.number].join('/')}
            >
              <span className="glyphicon glyphicon-chevron-left"></span>
            </a>
          </HeaderView>
          <div className="list">
            <div className={formGroupClasses}>
              <input
              type="text"
              ref="inputName"
              placeholder="Name"
              value={this.state.inputName}
              onChange={this.handleChange('inputName')}
              tabIndex='1'
              />
            </div>
            <div className="helper">
              <p>Provide a name for this key so you can remember to who it belongs.</p>
            </div>
            <div className="divider" />
            <div className={formGroupClasses}>
              <input
              type="number"
              ref="inputLimit"
              placeholder="Limit"
              defaultValue={this.defaults.limit}
              value={this.state.inputLimit}
              onChange={this.handleChange('inputLimit')}
              min='0'
              tabIndex='2'
              />
            </div>
            <div className="helper">
              <p>{'On how many devices should this key be redeemable?'}</p>
            </div>
            <div className="divider" />
            <div className={formGroupClasses}>
              <input
              type="date"
              ref="inputDate"
              placeholder="Expire Date"
              defaultValue={this.defaults.expireDate}
              value={this.state.inputExpireDate}
              onChange={this.handleChange('inputExpireDate')}
              tabIndex='3'
              />
            </div>
            <div className="helper">
              <p>{'On which date should this key expire? Defaults to one year.'}</p>
            </div>
          </div>
          <footer>
            <a className="button-full button-primary" onClick={this.generateKey}>Generate</a>
          </footer>
        </div>);
    }
  });
});
