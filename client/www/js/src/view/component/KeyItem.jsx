define([
  'react',
  'model/Key',
  'pages'
], function (React, Key, PAGE) {
  return React.createClass({
    propTypes: {
      keykey: React.PropTypes.instanceOf(Key).isRequired
    },

    render: function () {
      var key = this.props.keykey;

      var cx = React.addons.classSet;
      var classes = cx({
        'list-item': true,
        'key': true,
        'disabled': !key.valid
      });


      return (
        <div className={classes}>
          <span className="button left muted">
            <span className="fa fa-key"/>
          </span>
          <span className="pl center">
            <span>{key.name}</span>
          </span>
          <a className="button button-normal right" href={['#', PAGE.DOOR, this.props.deviceid, PAGE.DISABLE_KEY, key.key].join('/')} >
            <span className={"fa " + (key.valid ? 'fa-trash-o' : 'fa-undo')} />
          </a>
          <a className="button button-normal right" href={['#', PAGE.DOOR, this.props.deviceid, PAGE.EDIT_KEY, key.key].join('/')}>
            <span className="fa fa-pencil"/>
          </a>
        </div>);
    }
  });
});
