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

var EditorNoteIcon = function EditorNoteIcon(props) {
  return _react2.default.createElement(_index2.default, _extends({ dangerouslySetGlyph: '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M6 4.496C6 4.222 6.229 4 6.5 4h11a.5.5 0 0 1 .5.496v15.008a.502.502 0 0 1-.5.496h-11a.5.5 0 0 1-.5-.496V4.496zM8 7.5c0 .268.224.5.5.5h7c.27 0 .5-.224.5-.5 0-.268-.224-.5-.5-.5h-7c-.27 0-.5.224-.5.5zm0 3c0 .268.224.5.5.5h7c.27 0 .5-.224.5-.5 0-.268-.224-.5-.5-.5h-7c-.27 0-.5.224-.5.5zm0 3c0 .268.22.5.49.5h3.02c.275 0 .49-.224.49-.5a.5.5 0 0 0-.49-.5H8.49a.492.492 0 0 0-.49.5z" fill="currentColor" fill-rule="evenodd"/></svg>' }, props));
};
exports.default = EditorNoteIcon;