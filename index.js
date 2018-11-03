const expressSession = require('express-session');

const genRandom = () => Math.random().toString(16).split('.')[1];

module.exports = opts => ({
  onapp: (app) => {
    const paramObj = opts.param || opts;
    const {
      // won't persist across server restarts by default
      secret = genRandom(),
      resave = false,
      saveUninitialized = true,
      cookie = {},

      trustProxy = true,
    } = paramObj;

    const {
      secure = false,
      maxAge = 60000,
    } = cookie;

    cookie.secure = secure;
    cookie.maxAge = maxAge;

    if (trustProxy) {
      app.set('trust proxy', 1);
    }

    app.use(expressSession({
      ...paramObj,
      secret,
      resave,
      saveUninitialized,
      cookie,
    }));
  },

  before: ({ self, raw }) => {
    const {
      field = 'session',
      initialize = {},
    } = opts;

    const session = raw.req.session;

    if (!session._conac_session_initialized) {
      Object.assign(session, unfunction(initialize));
      session._conac_session_initialized = true;
    }
    self[field] = session;
  },
});

const unfunction = x => typeof x === 'function' ? x() : x;
