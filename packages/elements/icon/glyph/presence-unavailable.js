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

var PresenceUnavailableIcon = function PresenceUnavailableIcon(props) {
  return _react2.default.createElement(_index2.default, _extends({ dangerouslySetGlyph: '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M6 12a6 6 0 1 1 12 0 6 6 0 0 1-12 0z" fill="inherit"/><path d="M15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0zm-9 0a6 6 0 1 1 12 0 6 6 0 0 1-12 0z" fill="currentColor"/></svg>' }, props));
};
exports.default = PresenceUnavailableIcon;