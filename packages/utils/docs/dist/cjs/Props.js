'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  color: #BF2600;\n  margin-right: 10px;\n'], ['\n  color: #BF2600;\n  margin-right: 10px;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  border-top: 1px solid #ccc;\n  margin-top: 10px;\n'], ['\n  border-top: 1px solid #ccc;\n  margin-top: 10px;\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  margin: 10px;\n'], ['\n  margin: 10px;\n']),
    _templateObject4 = _taggedTemplateLiteral(['\n  text-transform: capitalize;\n  margin-right: 10px;\n'], ['\n  text-transform: capitalize;\n  margin-right: 10px;\n']),
    _templateObject5 = _taggedTemplateLiteral(['\n  border: 1px solid;\n  padding: 2px 5px;\n'], ['\n  border: 1px solid;\n  padding: 2px 5px;\n']);

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var primitiveValues = ['string', 'number', 'boolean', 'any', 'mixed'];

var PropRequired = _styledComponents2.default.span(_templateObject);

var PropsDefinitionWrapper = _styledComponents2.default.div(_templateObject2);

var PropWrapper = _styledComponents2.default.div(_templateObject3);

var PropName = _styledComponents2.default.span(_templateObject4);

var PropDefinition = _styledComponents2.default.span(_templateObject5);

var renderProperty = function renderProperty(prop) {
  var key = prop.key,
      value = prop.value,
      optional = prop.optional;

  var propInfo = void 0;

  if (value) {
    var kind = value.kind;

    if (kind === 'function') {
      var returnType = value.returnType.kind;
      var params = value.parameters.map(function (p) {
        return p.kind;
      }).join(', ');

      propInfo = '(' + params + ') => ' + returnType;
    }

    if (kind === 'nullable') {
      // ...
    }

    if (primitiveValues.includes(kind)) {
      propInfo = kind;
    }

    if (kind === 'union') {
      propInfo = value.types.map(function (type) {
        return type.value || type.kind;
      }).join(' | ');
    }

    if (kind === 'object') {
      propInfo = value.props.map(function (prop) {
        return renderProperty(prop);
      });
    }
  }

  return React.createElement(
    PropWrapper,
    { key: key },
    React.createElement(
      PropName,
      null,
      key,
      ':'
    ),
    !optional && React.createElement(
      PropRequired,
      null,
      'Required'
    ),
    React.createElement(
      PropDefinition,
      null,
      propInfo
    )
  );
};

var Props = function (_React$Component) {
  _inherits(Props, _React$Component);

  function Props() {
    _classCallCheck(this, Props);

    return _possibleConstructorReturn(this, (Props.__proto__ || Object.getPrototypeOf(Props)).apply(this, arguments));
  }

  _createClass(Props, [{
    key: 'render',
    value: function render() {
      var props = this.props.props;

      var propDefinitions = void 0;

      if (props && props.classes) {
        propDefinitions = props.classes.map(function (klass) {
          return klass.props.map(function (prop) {
            return renderProperty(prop);
          });
        });
      }

      return React.createElement(
        PropsDefinitionWrapper,
        null,
        propDefinitions
      );
    }
  }]);

  return Props;
}(React.Component);

exports.default = Props;