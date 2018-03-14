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

var PresenceBusyIcon = function PresenceBusyIcon(props) {
  return _react2.default.createElement(_index2.default, _extends({ dangerouslySetGlyph: '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><g fill-rule="evenodd"><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" fill="currentColor"/><path d="M9.367 9.363a1.241 1.241 0 0 1 1.747-.008l3.527 3.527c.48.48.48 1.26-.008 1.747a1.241 1.241 0 0 1-1.747.008l-3.527-3.526c-.48-.48-.48-1.26.008-1.748z" fill="inherit"/></g></svg>' }, props));
};
exports.default = PresenceBusyIcon;