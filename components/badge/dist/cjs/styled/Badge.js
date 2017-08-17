'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  background-color: ', ';\n  border-radius: 2em;\n  color: ', ';\n  display: inline-block;\n  font-size: 12px;\n  font-weight: normal;\n  line-height: 1;\n  min-width: 1px;\n  padding: 0.16666666666667em 0.5em;\n  text-align: center;\n'], ['\n  background-color: ', ';\n  border-radius: 2em;\n  color: ', ';\n  display: inline-block;\n  font-size: 12px;\n  font-weight: normal;\n  line-height: 1;\n  min-width: 1px;\n  padding: 0.16666666666667em 0.5em;\n  text-align: center;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _theme = require('../theme');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BadgeElement = _styledComponents2.default.div(_templateObject, _theme.backgroundColor, _theme.textColor);
BadgeElement.displayName = 'BadgeElement';

exports.default = BadgeElement;