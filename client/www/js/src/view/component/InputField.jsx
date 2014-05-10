define([
  'react'
], function (React) {
  return React.createClass({

    propTypes: {
      ref: React.PropTypes.string,
      placeholder: React.PropTypes.string,
      helper: React.PropTypes.component,
      hasError: React.PropTypes.bool,
      type: React.PropTypes.string,
      tabIndex: React.PropTypes.number,
      defaultValue: React.PropTypes.string
    },

    getInitialState: function () {
      return {
        value: this.props.defaultValue
      }
    },

    onChange: function () {
      var val = this.refs[this.props.ref].getDOMNode().value.trim();
      if (val === '') {
        val = this.props.defaultValue;
      }
      this.setState({
        value: val
      })
    },

    render: function () {
      var cx = React.addons.classSet;
      var formGroupClasses = cx({
        'list-item': true,
        'has-error': this.props.hasError
      });

      var helper;
      if (this.props.helper) {
        helper =
          <div className="helper">
            {this.props.helper}
          </div>;
      }

      return (
        <div>
          {helper}
          <div className={formGroupClasses}>
            <input
            type={this.props.type}
            ref={this.props.ref}
            placeholder={this.props.placeholder}
            value={this.state.value}
            onChange={this.onChange}
            tabIndex={this.props.tabIndex}
            defaultValue={this.props.defaultValue}
            min={this.props.min}
            max={this.props.max}
            />
          </div>
        </div>);
    }
  });
});
