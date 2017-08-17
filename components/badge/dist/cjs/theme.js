'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.textColor = exports.backgroundColor = undefined;

var _theme = require('@atlaskit/theme');

var backgroundColor = exports.backgroundColor = (0, _theme.themed)('appearance', {
  added: { light: _theme.colors.G50, dark: _theme.colors.G50 },
  default: { light: _theme.colors.N30, dark: _theme.colors.DN70 },
  important: { light: _theme.colors.R300, dark: _theme.colors.DN900 },
  primary: { light: _theme.colors.B400, dark: _theme.colors.DN600 },
  removed: { light: _theme.colors.R50, dark: _theme.colors.R50 }
});
var textColor = exports.textColor = (0, _theme.themed)('appearance', {
  added: { light: _theme.colors.G500, dark: _theme.colors.G500 },
  default: { light: _theme.colors.N500, dark: _theme.colors.DN900 },
  important: { light: _theme.colors.N0, dark: _theme.colors.DN0 },
  primary: { light: _theme.colors.N0, dark: _theme.colors.DN70 },
  removed: { light: _theme.colors.R500, dark: _theme.colors.R500 }
});