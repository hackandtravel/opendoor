define([
  'underscore',
  'react',
  'pages',
  'view/component/HeaderView',
  'view/component/InputField',
  'model/Key',
  'controller/controller'
], function (_, React, PAGE, HeaderView, InputField, Key, controller) {
  return React.createClass({
    propTypes: {
      status: React.PropTypes.string.isRequired,
      keykey: React.PropTypes.instanceOf(Key),
      buttonText: React.PropTypes.string,
      setRoute: React.PropTypes.func
    },

    generateKey: function () {
      var params = {
        name: this.refs['inputName'].state.value,
        limit: Number(this.refs['inputLimit'].state.value),
        expire: new Date(this.refs['inputDate'].state.value).getTime(),
        doors: [1, 2] // TODO
      };

      var error = {};
      if (!(params.name && params.name !== '')) {
        error.inputName = true;
      }

      if (!(params.limit && params.limit !== '')) {
        error.inputLimit = true;
      }

      if (_.size(error) === 0) {
        var func;
        var nextPage = [PAGE.DOOR, this.props.device.deviceid];
        if (this.props.keykey) {
          func = controller.updateKey;
          params = _.extend(this.props.keykey, params);
        } else {
          func = controller.generateKey;
          nextPage = nextPage.concat(PAGE.GENERATED_KEY);
        }

        func(this.props.device, params, {
          setLoading: this.setLoading,
          setStatus: this.setStatus,
          setError: this.setError,
          changePage: this.props.setRoute.bind(this, nextPage.join('/'))
        });
      } else {
        this.setState({
          hasError: error
        })
      }
    },

    defaults: {
      limit: '1',
      expireDate: _.now() + 1000 * 60 * 60 * 24 * 356
    },

    toInputDateFormat: function (dateable) {
      return new Date(dateable).toISOString().slice(0, 10)
    },

    getInitialState: function () {
      return {
        status: this.props.status,
        hasError: [],
        loading: false
      }
    },

    setStatus: function (status) {
      if (status === null) {
        status = this.props.status
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
        'page-middle': this.props.show,
        'page-right': !this.props.show
      });

      var status = <div className="center">{this.state.status}</div>;

      var key = this.props.keykey || {};

      return (
        <div id='page-new-door' className={classes}>
          <HeaderView loading={this.state.loading} header={status}>
            <a
            id="back-btn"
            className="new-door-page button button-normal left"
            href={['#', PAGE.DOOR, this.props.device.deviceid].join('/')}
            >
              <span className="glyphicon glyphicon-chevron-left"></span>
            </a>
          </HeaderView>
          <div className="list bottom">

            <InputField
            type="text"
            ref="inputName"
            placeholder="Name"
            defaultValue={key.name}
            helper={<p>Provide a name for this key so you can remember to who it belongs.</p>}
            hasError={!!this.state.hasError['inputName']}
            tabIndex={1}
            />
            <div className="divider" />

            <InputField
            type="number"
            ref="inputLimit"
            placeholder="Limit"
            defaultValue={String(key.limit || this.defaults.limit)}
            helper={<p>{"On how many devices should this key be redeemable?"}</p>}
            hasError={!!this.state.hasError['inputLimit']}
            min='1'
            tabIndex={2}
            />
            <div className="divider" />

            <InputField
            type="date"
            ref="inputDate"
            placeholder="Expire Date"
            defaultValue={this.toInputDateFormat(key.expire ? key.expire : this.defaults.expireDate)}
            helper={<p>{"On which date should this key expire? Defaults to one year."}</p>}
            hasError={!!this.state.hasError['inputDate']}
            tabIndex={3}
            />
            <div className="divider" />
          </div>
          <footer>
            <a
            className="button-full button-primary"
            onClick={this.generateKey}>
                {this.props.buttonText}
            </a>
          </footer>
        </div>);
    }
  });
});
