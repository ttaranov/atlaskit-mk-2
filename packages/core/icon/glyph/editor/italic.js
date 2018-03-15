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

var EditorItalicIcon = function EditorItalicIcon(props) {
  return _react2.default.createElement(_index2.default, _extends({ dangerouslySetGlyph: '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M10 6h6a1 1 0 0 1 0 2h-6a1 1 0 1 1 0-2zM8 16h6a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2zm4-8h2l-2 8h-2l2-8z" fill="currentColor" fill-rule="evenodd"/></svg>' }, props));
};
exports.default = EditorItalicIcon;