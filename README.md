# Baobab Provider

> baobab-provider NOW IN DEVELOPMENT! Star it and check soon!

Baobab Provider helps you make universal applications with React and Baobab.

## Installation

```bash
npm install --save baobab-provider
```

## Usage

Implement root of the Tree

```js
// application.js

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory, Route } from 'react-router';
import Baobab from 'baobab';
import { Provider } from 'baobab-provider';

import ExampleComponent from './components/ExampleComponent';

const reactRoot = window.document.getElementById('webapp');
const tree = new Baobab({
  user: {
    id: 200,
    profile: {
      name: 'Sergey',
      surname: 'Sova',
      age: 21
    }
  }
});

const routerRoot = (
  <Provider tree={tree}>
    <Router history={browserHistory}>
      <Route path="/" component={ExampleComponent} />
    </Router>
  </Provider>
);

ReactDOM.render(routerRoot, reactRoot);
```


Create simple actions

```js
// actions/profile.js

import { action } from 'baobab-provider';

// property should be named `fn`
export const updateProfile = action({
  fn({ name, surname, age }) {
    setTimeout(_ => {
      const cur = this.select('user', 'profile');
      cur.set({ name, surname, age });
    }, 400);
  }
});

export const resetProfile = action({
  fn() {
    this.select('user', 'profile').set({
      name: 'Sergey',
      surname: 'Sova',
      age: 21
    })
  }
});
```

Subscribe and fire action:

```js
// components/ExampleComponent.js

import React, { Component } from 'react';
import { subscribed } from 'baobab-provider';
import { updateProfile, resetProfile } from 'actions/callee';

@subscribed('user.profile')
export default class ExampleComponent extends Component {

  reload = () => {
    const upd = this.props.action(updateProfile);

    // Fire action with params
    upd({ name: 'jane', surname: 'bidd', age: 26 });
  }

  reset = () => {
    this.props.action(resetProfile)();
  }

  /**
   * Render component RootComponent
   */
  render() {
    const { name, surname, age } = this.props.userProfile;

    return (
      <div>
        <button onClick={this.reload}>{name} {surname} ({age}) - Update</button>
        <button onClick={this.reset}>Reset</button>
      </div>
    );
  }
}

```


## Roadmap

- Add build tools
- Add Node.js < 6 support
- Write universal examples
- Optimize code
- Write tests?
