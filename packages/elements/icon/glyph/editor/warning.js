'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _index = require('../../es5/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditorWarningIcon = function EditorWarningIcon(props) {
  return _react2.default.createElement(_index2.default, _extends({ dangerouslySetGlyph: '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M13 14.208v-3.71a.496.496 0 0 0-.505-.498h-.99a.494.494 0 0 0-.505.498v3.71A2.492 2.492 0 0 1 12 14c.356 0 .694.074 1 .208zm-1.49-9.336c.27-.482.712-.476.98 0l8.02 14.256c.27.482.045.872-.503.872H3.993c-.548 0-.77-.396-.503-.872l8.02-14.256zM12 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor" fill-rule="evenodd"/></svg>' }, props));
};
exports.default = EditorWarningIcon;