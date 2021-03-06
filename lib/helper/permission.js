'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PermissionAsync = exports.Permission = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _class, _class2;

var _autobind = require('./autobind');

var _autobind2 = _interopRequireDefault(_autobind);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noop = function noop() {};
/**
 * Create decoractor used for permission
 * @param {Function} checker method check wether has permission
 * @param {Function} successCallback callback when visitor has permission
 * @param {Function} failCallback callback when visitor has no permission
 */
var needSomethingAsync = function needSomethingAsync(checker) {
  var successCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
  var failCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;

  return function (target, name, descriptor) {
    var oldValue = descriptor.value;
    descriptor.value = function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var pass,
            _len,
            args,
            _key,
            _args = arguments;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return checker();

              case 2:
                pass = _context.sent;

                if (!pass) {
                  _context.next = 9;
                  break;
                }

                successCallback();

                for (_len = _args.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = _args[_key];
                }

                return _context.abrupt('return', oldValue.apply(this, args));

              case 9:
                failCallback();

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function () {
        return _ref.apply(this, arguments);
      };
    }();
  };
};

var needSomething = function needSomething(checker) {
  var successCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
  var failCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;

  return function (target, name, descriptor) {
    var oldValue = descriptor.value;
    descriptor.value = function () {
      if (checker()) {
        successCallback();

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return oldValue.apply(this, args);
      } else {
        failCallback();
      }
    };
  };
};

/**
 * Return closure function accept method which is used to fetch
 * user permission list and return checker closure that validate
 * visitor according to list used for validation.
 * @param {String} type array method used for validation
 * @param {Function} fnFetch method which is used to fetch permission list
 * @param {Array<String>} permissionList string list for validation
 */
var createValidationMethodAsync = function createValidationMethodAsync(type) {
  return function (fnFetch) {
    return function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        for (var _len3 = arguments.length, permissionList = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          permissionList[_key3] = arguments[_key3];
        }

        var list;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(typeof fnFetch !== 'function')) {
                  _context2.next = 2;
                  break;
                }

                throw new Error('fnFetch must be function');

              case 2:
                _context2.next = 4;
                return fnFetch();

              case 4:
                list = _context2.sent;
                return _context2.abrupt('return', list[type](function (item) {
                  return permissionList.indexOf(item) > -1;
                }));

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      return function () {
        return _ref2.apply(this, arguments);
      };
    }();
  };
};

var createValidationMethod = function createValidationMethod(type) {
  return function (fnFetch) {
    return function () {
      for (var _len4 = arguments.length, permissionList = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        permissionList[_key4] = arguments[_key4];
      }

      if (typeof fnFetch !== 'function') {
        throw new Error('fnFetch must be function');
      }
      var list = fnFetch();
      return list[type](function (item) {
        return permissionList.indexOf(item) > -1;
      });
    };
  };
};

var needEveryPermissionAsync = createValidationMethodAsync('every');
var needEveryPermission = createValidationMethod('every');

var needAnyPermissionAsync = createValidationMethodAsync('some');
var needAnyPermission = createValidationMethod('some');

/**
 * Permission Class initialize instance for permission validation,
 * permission fetch method, success callback and failed callback
 * of frontend and backend are different.
 */

// Async version permission

var PermissionAsync = (0, _autobind2.default)(_class = function () {
  function PermissionAsync(fnFetch, successCallback, failCallback) {
    (0, _classCallCheck3.default)(this, PermissionAsync);

    this.fnFetch = fnFetch;
    this.successCallback = successCallback;
    this.failCallback = failCallback;
  }
  // decoractor version method of needEveryPermission


  (0, _createClass3.default)(PermissionAsync, [{
    key: 'everyPermissionAsync',
    value: function everyPermissionAsync() {
      var _this = this;

      for (var _len5 = arguments.length, list = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        list[_key5] = arguments[_key5];
      }

      var checker = function checker() {
        return needEveryPermissionAsync(_this.fnFetch).apply(undefined, list);
      };
      return needSomethingAsync(checker, this.successCallback, this.failCallback);
    }

    // decoractor version method of needAnyPermission

  }, {
    key: 'anyPermissionAsync',
    value: function anyPermissionAsync() {
      var _this2 = this;

      for (var _len6 = arguments.length, list = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        list[_key6] = arguments[_key6];
      }

      var checker = function checker() {
        return needAnyPermissionAsync(_this2.fnFetch).apply(undefined, list);
      };
      return needSomethingAsync(checker, this.successCallback, this.failCallback);
    }
  }, {
    key: 'needEveryPermissionAsync',
    get: function get() {
      return needEveryPermissionAsync(this.fnFetch);
    }
  }, {
    key: 'needAnyPermissionAsync',
    get: function get() {
      return needAnyPermissionAsync(this.fnFetch);
    }
  }]);
  return PermissionAsync;
}()) || _class;

// Sync version permission


var Permission = (0, _autobind2.default)(_class2 = function () {
  function Permission(fnFetch, successCallback, failCallback) {
    (0, _classCallCheck3.default)(this, Permission);

    this.fnFetch = fnFetch;
    this.successCallback = successCallback;
    this.failCallback = failCallback;
  }
  // decoractor version method of needEveryPermission


  (0, _createClass3.default)(Permission, [{
    key: 'everyPermission',
    value: function everyPermission() {
      var _this3 = this;

      for (var _len7 = arguments.length, list = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        list[_key7] = arguments[_key7];
      }

      var checker = function checker() {
        return needEveryPermission(_this3.fnFetch).apply(undefined, list);
      };
      return needSomething(checker, this.successCallback, this.failCallback);
    }

    // decoractor version method of needAnyPermission

  }, {
    key: 'anyPermission',
    value: function anyPermission() {
      var _this4 = this;

      for (var _len8 = arguments.length, list = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        list[_key8] = arguments[_key8];
      }

      var checker = function checker() {
        return needAnyPermission(_this4.fnFetch).apply(undefined, list);
      };
      return needSomething(checker, this.successCallback, this.failCallback);
    }
  }, {
    key: 'needEveryPermission',
    get: function get() {
      return needEveryPermission(this.fnFetch);
    }
  }, {
    key: 'needAnyPermission',
    get: function get() {
      return needAnyPermission(this.fnFetch);
    }
  }]);
  return Permission;
}()) || _class2;

exports.Permission = Permission;
exports.PermissionAsync = PermissionAsync;