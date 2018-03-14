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

var EditorHelpIcon = function EditorHelpIcon(props) {
  return _react2.default.createElement(_index2.default, _extends({ dangerouslySetGlyph: '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M8 10h2.5c0-2 1.5-2 1.5-2 1.5 0 2.5 1.5.5 3-1.5 1-1.5 1.5-1.5 3 0 .144-.016.824 0 1h2c0-1.568 0-2 1.5-3 1.446-.964 1.5-1.896 1.5-3 0-2-1.5-3-4-3-2 0-4 1-4 4zm5 8v-2h-2v2h2z" fill="currentColor" fill-rule="evenodd"/></svg>' }, props));
};
exports.default = EditorHelpIcon;