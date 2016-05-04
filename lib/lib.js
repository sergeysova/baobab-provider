'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Provider = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.action = action;
exports.provide = provide;
exports.subscribed = subscribed;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ResolverType = _react.PropTypes.object;
const BaobabType = _react.PropTypes.object;

class Provider extends _react.Component {

  getChildContext() {
    return {
      tree: this.props.tree
    };
  }

  render() {
    return _react.Children.only(this.props.children);
  }
}

exports.Provider = Provider;
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
  return () => actionDefinition;
}

function provide(TargetComponent) {
  if (!TargetComponent.contextTypes) TargetComponent.contextTypes = {};
  TargetComponent.contextTypes.tree = BaobabType;

  TargetComponent.prototype.action = function (actionFunction) {
    var _context;

    var _actionFunction = actionFunction();

    const TYPE = _actionFunction.TYPE;
    const fn = _actionFunction.fn;

    if (TYPE !== 'ACTION') throw new Error('Please, create action with helper `action({ fn(){} })`');
    return (_context = this.context.tree, fn).bind(_context);
  };

  return TargetComponent;
}

function subscribed(...branches) {
  let cursors = {};
  let cursorNames = [];

  for (let idx in branches) {
    const branch = branches[idx];
    cursors[makeNameFromBranch(branch)] = branch.split('.');
    cursorNames.push(branch);
  }

  return ClearTargetComponent => {
    var _class, _temp;

    const TargetComponent = provide(ClearTargetComponent);

    // Composed class
    const Composed = (_temp = _class = class extends _react.Component {

      constructor(props, context) {
        super(props, context);

        this.watcher = null;
        this.cursors = null;
        this.watcher = this.context.tree.watch(cursors);
        this.cursors = this.watcher.getCursors();
        this.state = this.watcher.get();
      }

      componentWillMount() {
        if (!this.watcher) return;

        this.watcher.on('update', () => {
          if (this.watcher) {
            this.setState(this.watcher.get());
          }
        });
      }

      componentWillReceiveProps(props) {
        if (!this.watcher || !cursors) return;

        this.watcher.refresh(cursors);
        this.cursors = this.watcher.getCursors();
        this.setState(this.watcher.get());
      }

      componentWillUnmount() {
        if (!this.watcher) return;

        this.watcher.release();
        this.wathcer = null;
      }

      // Apply props to Target
      render() {
        return _react2.default.createElement(TargetComponent, _extends({}, this.props, this.state));
      }
    }, _class.displayName = `Branched${ TargetComponent.name }(${ cursorNames.join(',') })`, _class.contextTypes = {
      tree: BaobabType
    }, _temp);

    return Composed;
  };
}

function makeNameFromBranch(branch) {
  let chunks = branch.split('.');
  let name = chunks.splice(0, 1);

  for (let chunk of chunks) {
    name += chunk.charAt(0).toUpperCase() + chunk.slice(1);
  }

  return name;
}

