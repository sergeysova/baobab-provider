import React, { Component, PropTypes, Children } from 'react';
// import { branch as BaobabBranch, root as BaobabRoot } from 'baobab-react/higher-order';

const ResolverType = PropTypes.object;
const BaobabType = PropTypes.object;


export class Provider extends Component {
  static displayName = 'BaobabProvider';

  static propTypes = {
    tree: BaobabType.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ]).isRequired,
  };

  static childContextTypes = {
    tree: BaobabType,
  };

  getChildContext() {
    return {
      tree: this.props.tree,
    }
  }

  render() {
    return Children.only(this.props.children);
  }
}

export function action(actionDefinition) {
  actionDefinition.TYPE = 'ACTION';
  return () => actionDefinition;
}


export function subscribed(...branches) {
  let cursors = {};
  let cursorNames = [];

  for (let branch of branches) {
    cursors[makeNameFromBranch(branch)] = branch.split('.');
    cursorNames.push(branch);
  }


  return (TargetComponent) => {
    // Composed class
    const Composed = class extends Component {
      static displayName = `Branched${TargetComponent.name}(${cursorNames.join(',')})`

      static contextTypes = {
        tree: BaobabType
      };

      watcher = null;
      cursors = null;

      constructor(props, context) {
        super(props, context);

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

      // Pass method to Target as prop
      action = (actionFunction) => {
        const { TYPE, fn } = actionFunction();

        if (TYPE !== 'ACTION') throw new Error('Please, create action with helper `action({ fn(){} })`');

        return this.context.tree::fn;
      };

      // Apply props to Target
      render() {
        return <TargetComponent {...this.props} {...this.state} action={this.action} />
      }
    }

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
