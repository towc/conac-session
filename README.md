# conac-session
session plugin for conac

# install
Start your conac project, and run

```sh
npm i -S conac-session
```

# setup
Add the plugin in the conac constructor. It has dev-sensible defaults, so this will work:

```js
new Conac({
  ...
  plugin: [
    ...
    'conac-session',
    ...
  ],
  ...
});
```

You will likely want different settings. Instead of passing the string, use:

```js
new Conac({
  ...
  plugin: [
    ...
    {
      pkg: 'conac-session',
      param: {
        cookie: { secure: true },
      },
      field: 'sess',
      initialize: {
        views: 0,
      }
    },
  ]
});
```

## param
The `param` property is directly passed to express-session, after some undefined values are substituted with defaults.

## field
The `field` property determines under what name the `req.session` will be added to the accumulator. Default is `'session'`

## initialize
The `initialize` property sets additional initial values of the session, so you don't have to do it in the routes. This can be an object, or a function that returns an object, to avoid using the same references. Default is `{}`

Keep in mind that the defaults are NOT good for production.

# usage

Here's a full sample application:

```js
const { Conac, affirm } = require('conac');

new Conac({
  plugin: [{
    pkg: 'conac-session',
    field: 'user',
    initialize: {
      counter: 0,
    },
  }],
  routes: {
    'get /': ({ user }) => {
      return user.counter;
    },
    'get /inc': ({ user }) => {
      user.counter += 1;

      return user.counter;
    },
    'get /dec': ({ user }) => {
      user.counter -= 1;

      return user.counter;
    },
    'get /set/:value': ({ user, data }) => {
      user.counter = Number(data.value);

      return user.counter;
    }
  }
});
```

Every session will have a different counter, initialized at 0. Here's a few examples

```
USER  PATH    RESPONSE
Ada   /       { success: true, data: 0 }
Ada   /inc    { success: true, data: 1 }
Ada   /inc    { success: true, data: 2 }
Ada   /inc    { success: true, data: 3 }
Ada   /dec    { success: true, data: 2 }
Ada   /dec    { success: true, data: 1 }
Ada   /dec    { success: true, data: 0 }
Ada   /dec    { success: true, data: -1 }
Ada   /       { success: true, data: -1 }
Ada   /set/5  { success: true, data: 5 }
Ada   /inc    { success: true, data: 6 }
Bob   /       { success: true, data: 0 }
Bob   /inc    { success: true, data: 1 }
Ada   /       { success: true, data: 6 }
```
