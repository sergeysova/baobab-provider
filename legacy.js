'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Provider = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.action = action;
exports.provide = provide;
exports.subscribed = subscribed;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ResolverType = _react.PropTypes.object;
var BaobabType = _react.PropTypes.object;

var Provider = exports.Provider = function (_Component) {
  _inherits(Provider, _Component);

  function Provider() {
    _classCallCheck(this, Provider);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Provider).apply(this, arguments));
  }

  _createClass(Provider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        tree: this.props.tree
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return _react.Children.only(this.props.children);
    }
  }]);

  return Provider;
}(_react.Component);

Provider.displayName = 'BaobabProvider';
Provider.propTypes = {
  tree: BaobabType.isRequired,
  children: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.arrayOf(_react.PropTypes.element)]).isRequired
};
Provider.childContextTypes = {
  tree: BaobabType
};
function action(actionDefinition) {
  actionDefinition.TYPE = 'ACTION';
  return function () {
    return actionDefinition;
  };
}

function provide(TargetComponent) {
  if (!TargetComponent.contextTypes) TargetComponent.contextTypes = {};
  TargetComponent.contextTypes.tree = BaobabType;

  TargetComponent.prototype.action = function (actionFunction) {
    var _context;

    var _actionFunction = actionFunction();

    var TYPE = _actionFunction.TYPE;
    var fn = _actionFunction.fn;

    if (TYPE !== 'ACTION') throw new Error('Please, create action with helper `action({ fn(){} })`');
    return (_context = this.context.tree, fn).bind(_context);
  };

  return TargetComponent;
}

function subscribed() {
  var cursors = {};
  var cursorNames = [];

  for (var _len = arguments.length, branches = Array(_len), _key = 0; _key < _len; _key++) {
    branches[_key] = arguments[_key];
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = branches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var branch = _step.value;

      cursors[makeNameFromBranch(branch)] = branch.split('.');
      cursorNames.push(branch);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return function (ClearTargetComponent) {
    var _class, _temp;

    var TargetComponent = provide(ClearTargetComponent);

    // Composed class
    var Composed = (_temp = _class = function (_Component2) {
      _inherits(_class, _Component2);

      function _class(props, context) {
        _classCallCheck(this, _class);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this, props, context));

        _this2.watcher = null;
        _this2.cursors = null;


        _this2.watcher = _this2.context.tree.watch(cursors);
        _this2.cursors = _this2.watcher.getCursors();
        _this2.state = _this2.watcher.get();
        return _this2;
      }

      _createClass(_class, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          var _this3 = this;

          if (!this.watcher) return;

          this.watcher.on('update', function () {
            if (_this3.watcher) {
              _this3.setState(_this3.watcher.get());
            }
          });
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(props) {
          if (!this.watcher || !cursors) return;

          this.watcher.refresh(cursors);
          this.cursors = this.watcher.getCursors();
          this.setState(this.watcher.get());
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          if (!this.watcher) return;

          this.watcher.release();
          this.wathcer = null;
        }

        // Apply props to Target

      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(TargetComponent, _extends({}, this.props, this.state));
        }
      }]);

      return _class;
    }(_react.Component), _class.displayName = 'Branched' + TargetComponent.name + '(' + cursorNames.join(',') + ')', _class.contextTypes = {
      tree: BaobabType
    }, _temp);

    return Composed;
  };
}

function makeNameFromBranch(branch) {
  var chunks = branch.split('.');
  var name = chunks.splice(0, 1);

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = chunks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var chunk = _step2.value;

      name += chunk.charAt(0).toUpperCase() + chunk.slice(1);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return name;
}

