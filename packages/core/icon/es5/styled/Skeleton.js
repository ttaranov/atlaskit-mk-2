'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  width: ', ';\n  height: ', ';\n  display: inline-block;\n  border-radius: 50%;\n  background-color: ', ';\n  opacity: ', ';\n'], ['\n  width: ', ';\n  height: ', ';\n  display: inline-block;\n  border-radius: 50%;\n  background-color: ', ';\n  opacity: ', ';\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _styledComponents2.default.div(_templateObject, function (props) {
  return _constants.sizes[props.size];
}, function (props) {
  return _constants.sizes[props.size];
}, function (_ref) {
  var color = _ref.color;
  return color || 'currentColor';
}, function (_ref2) {
  var weight = _ref2.weight;
  return weight === 'strong' ? 0.3 : 0.15;
});