# Baobab Provider

[![Downloads](https://img.shields.io/npm/dm/baobab-provider.svg)](https://www.npmjs.com/package/baobab-provider)

> baobab-provider NOW IN DEVELOPMENT! Star it and check soon!

Baobab Provider helps you make universal applications with React and Baobab.

## Installation

```bash
npm install --save baobab-provider
```

For node version lower 6:

```js
var BaobabProvider = require('baobab-provider/legacy');
```


## Usage

> Hint: For babel 6 install `babel-plugin-transform-decorators-legacy`

Implement root of the Tree

```js
// application.js

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory, Route } from 'react-router';
import Baobab from 'baobab';
import { Provider } from 'baobab-provider';

import ExampleComponent from './components/ExampleComponent';
import IndexAbout from './containers/IndexAbout';

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
      <Route path="/about" component={IndexAbout} />
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

import React, { Component, PropTypes } from 'react';
import { subscribed } from 'baobab-provider';
import { updateProfile, resetProfile } from 'actions/profile';

// Baobab.select('user', 'profile').get()
@subscribed('user.profile')
export default class ExampleComponent extends Component {

  // userProfile contains data from Baobab
  static propTypes = {
    userProfile: PropTypes.shape({
      name: PropTypes.string,
      surname: PropTypes.string,
      age: PropTypes.number,
    }).isRequired
  };

  reload = () => {
    const upd = this.action(updateProfile);

    // Fire action with params
    upd({ name: 'jane', surname: 'bidd', age: 26 });
  }

  reset = () => {
    // Fire without storing action to variable
    this.action(resetProfile)();
  }

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

Run action without subscribe

```js
// containers/IndexAbout.js
import React, { Component } from 'react';
import { updateProfile } from 'actions/profile';
import { provide } from 'baobab-provider';


@provide
export default class IndexAbout extends Component {

  /**
   * Render component IndexAbout
   */
  render() {
    return (
      <div>
        <h3>IndexAbout</h3>
        <button onClick={() => this.action(updateProfile)({ name: 'Argh', surname: 'Roror', age: 561 })}>Set profile from another component</button>
      </div>
    );
  }
}

```


## Use baobab provider without decorators

```js

// Subscribe

class ExampleComponent extends Component {}
export default subscribed(ExampleComponent)('user.profile');


// Provide

class IndexAbout extends Component {}
export default provide(IndexAbout);

```

## Multi subscribes

```js

@subscribed('user.profile', 'settings.opened')
export default class Example {
  static propTypes = {
    userProfile: PropTypes.object,
    settingsOpened: PropTypes.object,
  }
}
```

## Roadmap

- Add build tools
- Write universal examples
- Optimize code
- Write tests?
