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

var JiraIcon = function JiraIcon(props) {
  return _react2.default.createElement(_index2.default, _extends({ dangerouslySetGlyph: '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><defs><linearGradient x1="90.985%" y1="7.469%" x2="58.888%" y2="40.766%" id="a-idPlaceholder"><stop stop-color="inherit" stop-opacity=".4" offset="0%"/><stop stop-color="inherit" offset="100%"/></linearGradient></defs><path d="M21.114 2h-9.606a4.336 4.336 0 0 0 4.336 4.336h1.77v1.708a4.336 4.336 0 0 0 4.333 4.334V2.833A.833.833 0 0 0 21.114 2z" fill="currentColor"/><path d="M16.361 6.786H6.756a4.336 4.336 0 0 0 4.333 4.333h1.77v1.714a4.336 4.336 0 0 0 4.335 4.33V7.62a.833.833 0 0 0-.833-.833z" fill="url(#a-idPlaceholder)"/><path d="M11.606 11.57H2a4.336 4.336 0 0 0 4.336 4.336h1.775v1.708a4.336 4.336 0 0 0 4.328 4.333v-9.544a.833.833 0 0 0-.833-.834z" fill="url(#a-idPlaceholder)"/></svg>' }, props));
};
JiraIcon.displayName = 'JiraIcon';
exports.default = JiraIcon;