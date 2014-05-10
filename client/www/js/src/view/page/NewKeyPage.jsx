define([
  'react',
  'pages',
  'view/component/HeaderView',
  'view/component/InputField',
  'controller/controller'
], function (React, PAGE, HeaderView, InputField, controller) {
  return React.createClass({
    generateKey: function () {
      var params = {
        name: this.refs.inputName.state.value,
        limit: Number(this.refs.inputLimit.state.value),
        expire: new Date(this.refs.inputDate.state.value).getTime(),
        doors: [this.props.door.number]
      };
      controller.generateKey(this.props.door, params, {
        setLoading: this.setLoading,
        setStatus: this.setStatus,
        setKey: this.props.setKey
      });
    },

    defaults: {
      name: 'New Key',
      limit: '3',
      expireDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 356).toISOString().slice(0, 10)
    },

    getInitialState: function () {
      return {
        status: 'Generate Key',
        hasError: false,
        loading: false
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

    render: function () {
      var cx = React.addons.classSet;
      var classes = cx({
        'page': true,
        'page-left': false,
        'page-middle': this.props.page === PAGE.NEW_KEY,
        'page-right': this.props.page !== PAGE.NEW_KEY
      });

      var status = <div className="center">{this.state.status}</div>;
      var door = this.props.door;

      return (
        <div id='page-new-door' className={classes}>
          <HeaderView loading={this.state.loading} header={status}>
            <a
            id="back-btn"
            className="new-door-page button button-normal left"
            href={['#', PAGE.DOOR, door.deviceid].join('/')}
            >
              <span className="glyphicon glyphicon-chevron-left"></span>
            </a>
          </HeaderView>
          <div className="list">

            <InputField
            type="text"
            ref="inputName"
            placeholder="Name"
            helper={<p>Provide a name for this key so you can remember to who it belongs.</p>}
            hasError={false}
            tabIndex={1}
            />
            <div className="divider" />

            <InputField
            type="number"
            ref="inputLimit"
            placeholder="Limit"
            defaultValue={this.defaults.limit}
            helper={<p>On how many devices should this key be redeemable?</p>}
            hasError={false}
            min='1'
            tabIndex={2}
            />
            <div className="divider" />

            <InputField
            type="date"
            ref="inputDate"
            placeholder="Expire Date"
            defaultValue={this.defaults.expireDate}
            helper={<p>On which date should this key expire? Defaults to one year.</p>}
            hasError={false}
            tabIndex={3}
            />
            <div className="divider" />

          </div>
          <footer>
            <a className="button-full button-primary" onClick={this.generateKey}>Generate</a>
          </footer>
        </div>);
    }
  });
});
