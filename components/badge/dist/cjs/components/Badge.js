'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.APPEARANCE_ENUM = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Badge = require('../styled/Badge');

var _Badge2 = _interopRequireDefault(_Badge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var APPEARANCE_ENUM = exports.APPEARANCE_ENUM = {
  values: ['default', 'primary', 'important', 'added', 'removed'],
  defaultValue: 'default'
};

function validAppearance(value) {
  return value && APPEARANCE_ENUM.values.includes(value) ? value : APPEARANCE_ENUM.defaultValue;
}

function getValue(value, max) {
  if (value < 0) {
    return '0';
  }
  if (max > 0 && value > max) {
    return max + '+';
  }
  if (value === Infinity) {
    return '\u221E'; // ∞ inifinity character
  }
  return String(value);
}

var Badge = function (_PureComponent) {
  (0, _inherits3.default)(Badge, _PureComponent);

  function Badge() {
    (0, _classCallCheck3.default)(this, Badge);
    return (0, _possibleConstructorReturn3.default)(this, (Badge.__proto__ || (0, _getPrototypeOf2.default)(Badge)).apply(this, arguments));
  }

  (0, _createClass3.default)(Badge, [{
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      var _props = this.props,
          onValueUpdated = _props.onValueUpdated,
          oldValue = _props.value;
      var newValue = nextProps.value;


      if (onValueUpdated && newValue !== oldValue) {
        onValueUpdated({ oldValue: oldValue, newValue: newValue });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          appearance = _props2.appearance,
          max = _props2.max,
          value = _props2.value;


      return _react2.default.createElement(
        _Badge2.default,
        { appearance: validAppearance(appearance) },
        getValue(value, max)
      );
    }
  }]);
  return Badge;
}(_react.PureComponent);

Badge.defaultProps = {
  appearance: 'default',
  max: 99,
  value: 0
};
exports.default = Badge;