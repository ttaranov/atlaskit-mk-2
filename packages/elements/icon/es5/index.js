'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Skeleton = exports.size = undefined;

var _Skeleton = require('./components/Skeleton');

Object.defineProperty(exports, 'Skeleton', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Skeleton).default;
  }
});

var _Icon = require('./components/Icon');

var _Icon2 = _interopRequireDefault(_Icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _Icon2.default;
exports.size = _Icon.size;