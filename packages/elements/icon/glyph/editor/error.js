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

var EditorErrorIcon = function EditorErrorIcon(props) {
  return _react2.default.createElement(_index2.default, _extends({ dangerouslySetGlyph: '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M12.706 3.706a1.003 1.003 0 0 0-1.412 0l-7.588 7.588a1.003 1.003 0 0 0 0 1.412l7.588 7.588c.39.39 1.026.386 1.412 0l7.588-7.588c.39-.39.386-1.026 0-1.412l-7.588-7.588zM13 12.208v-3.71A.496.496 0 0 0 12.495 8h-.99a.494.494 0 0 0-.505.498v3.71A2.492 2.492 0 0 1 12 12c.356 0 .694.074 1 .208zM12 16a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" fill="currentColor" fill-rule="evenodd"/></svg>' }, props));
};
exports.default = EditorErrorIcon;