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

var UserAvatarCircleIcon = function UserAvatarCircleIcon(props) {
  return _react2.default.createElement(_index2.default, _extends({ dangerouslySetGlyph: '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><g fill-rule="evenodd"><circle fill="currentColor" cx="12" cy="12" r="10"/><circle fill="inherit" cx="12" cy="9" r="3"/><path d="M7 18.245A7.966 7.966 0 0 0 12 20c1.892 0 3.63-.657 5-1.755V15c0-1.115-.895-2-2-2H9c-1.113 0-2 .895-2 2v3.245z" fill="inherit" fill-rule="nonzero"/></g></svg>' }, props));
};
UserAvatarCircleIcon.displayName = 'UserAvatarCircleIcon';
exports.default = UserAvatarCircleIcon;