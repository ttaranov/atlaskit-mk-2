'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.size = exports.IconWrapper = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  ', ' color: ', ';\n  display: inline-block;\n  fill: ', ';\n  flex-shrink: 0;\n  line-height: 1;\n\n  > svg {\n    ', ' max-height: 100%;\n    max-width: 100%;\n    overflow: hidden;\n    pointer-events: none;\n    vertical-align: bottom;\n  }\n  /* Stop-color doesn\'t properly apply in chrome when the inherited/current color changes.\n   * We have to initially set stop-color to inherit (either via DOM attribute or an initial CSS\n   * rule) and then override it with currentColor for the color changes to be picked up.\n   */\n  stop {\n    stop-color: currentColor;\n  }\n'], ['\n  ', ' color: ', ';\n  display: inline-block;\n  fill: ', ';\n  flex-shrink: 0;\n  line-height: 1;\n\n  > svg {\n    ', ' max-height: 100%;\n    max-width: 100%;\n    overflow: hidden;\n    pointer-events: none;\n    vertical-align: bottom;\n  }\n  /* Stop-color doesn\'t properly apply in chrome when the inherited/current color changes.\n   * We have to initially set stop-color to inherit (either via DOM attribute or an initial CSS\n   * rule) and then override it with currentColor for the color changes to be picked up.\n   */\n  stop {\n    stop-color: currentColor;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _theme = require('@atlaskit/theme');

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getSize = function getSize(props) {
  if (props.size) {
    return 'height: ' + _constants.sizes[props.size] + '; width: ' + _constants.sizes[props.size] + ';';
  }
  return null;
};

var IconWrapper = exports.IconWrapper = _styledComponents2.default.span(_templateObject, getSize, function (p) {
  return p.primaryColor || 'currentColor';
}, function (p) {
  return p.secondaryColor || _theme.colors.background;
}, getSize);

var Icon = function (_Component) {
  (0, _inherits3.default)(Icon, _Component);

  function Icon() {
    (0, _classCallCheck3.default)(this, Icon);
    return (0, _possibleConstructorReturn3.default)(this, (Icon.__proto__ || (0, _getPrototypeOf2.default)(Icon)).apply(this, arguments));
  }

  (0, _createClass3.default)(Icon, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          Glyph = _props.glyph,
          dangerouslySetGlyph = _props.dangerouslySetGlyph,
          onClick = _props.onClick,
          primaryColor = _props.primaryColor,
          secondaryColor = _props.secondaryColor,
          size = _props.size;

      // handling the glyphs as strings

      if (dangerouslySetGlyph) {
        return _react2.default.createElement(IconWrapper, {
          onClick: onClick,
          primaryColor: primaryColor,
          secondaryColor: secondaryColor,
          size: size,
          'aria-label': this.props.label,
          dangerouslySetInnerHTML: {
            __html: Icon.insertDynamicGradientID(dangerouslySetGlyph)
          }
        });
      }
      // handling the glyphs when passed through as functions
      return _react2.default.createElement(
        IconWrapper,
        {
          onClick: onClick,
          primaryColor: primaryColor,
          secondaryColor: secondaryColor,
          size: size,
          'aria-label': this.props.label
        },
        Glyph ? _react2.default.createElement(Glyph, { role: 'presentation' }) : null
      );
    }
  }], [{
    key: 'insertDynamicGradientID',


    /* Icons need unique gradient IDs across instances for different gradient definitions to work
     * correctly.
     * A step in the icon build process replaces linear gradient IDs and their references in paths
     * to a placeholder string so we can replace them with a dynamic ID here.
     * Replacing the original IDs with placeholders in the build process is more robust than not
     * using placeholders as we do not have to rely on regular expressions to find specific element
     * to replace.
     */
    value: function insertDynamicGradientID(svgStr) {
      var id = (0, _uuid2.default)();

      var replacedSvgStr = svgStr.replace(/id="([^"]+)-idPlaceholder"/g, 'id=$1-' + id).replace(/fill="url\(#([^"]+)-idPlaceholder\)"/g, 'fill="url(#$1-' + id + ')"');

      return replacedSvgStr;
    }
  }]);
  return Icon;
}(_react.Component);

Icon.defaultProps = {
  onClick: function onClick() {}
};
exports.default = Icon;
var size = exports.size = (0, _keys2.default)(_constants.sizes).reduce(function (p, c) {
  return (0, _assign2.default)(p, (0, _defineProperty3.default)({}, c, c));
}, {});