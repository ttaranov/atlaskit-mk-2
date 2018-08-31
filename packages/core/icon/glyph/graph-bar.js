'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _index = require('../es5/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GraphBarIcon = function GraphBarIcon(props) {
  return _react2.default.createElement(_index2.default, _extends({ dangerouslySetGlyph: '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><g fill="currentColor" fill-rule="evenodd"><rect x="17" y="5" width="4" height="11" rx="2"/><rect x="11" y="8" width="4" height="8" rx="2"/><rect x="5" y="11" width="4" height="5" rx="2"/><path d="M21 17H4.995C4.448 17 4 16.548 4 15.991V6a1 1 0 1 0-2 0v9.991A3.004 3.004 0 0 0 4.995 19H21a1 1 0 0 0 0-2z" fill-rule="nonzero"/></g></svg>' }, props));
};
GraphBarIcon.displayName = 'GraphBarIcon';
exports.default = GraphBarIcon;