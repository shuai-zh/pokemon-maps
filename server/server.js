import express from 'express';
import path from 'path';
//import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import flash from 'connect-flash';
import toastr from 'express-toastr';
import expressSession from 'express-session';
import expressValidator from 'express-validator';
import enforce from 'express-sslify';
import compression from 'compression';
import nunjucks from 'nunjucks';
import passport from 'passport';
import {Strategy} from 'passport-facebook';

import config from './config/application';
import injectGlobal from './middlewares/inject-globals';
import injectToastr from './middlewares/inject-toastr';

import routes from './routes/index';
import auth from './routes/auth';

// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/return'
  },
  (accessToken, refreshToken, profile, cb) => {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Twitter profile is serialized
// and deserialized.
passport.serializeUser((user, cb)=> {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

const app = express();
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));

let nunjucksConfig = config.nunjucksConfig;
nunjucksConfig.express = app;

let engine = nunjucks.configure([app.get('views'), path.join(__dirname, '../client')], nunjucksConfig);
app.set('engine', engine);


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator({
  customValidators: {
    isArray: function (value) {
      return Array.isArray(value);
    }
  }
}));
app.use(cookieParser());
app.use(expressSession({secret: 'verySecretSalt', resave: true, saveUninitialized: true}));
app.use(flash());
app.use(toastr());
app.use(injectGlobal);
app.use(injectToastr);
// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// static assets
config.staticDirs.forEach((dir) => {
  app.use(express.static(dir));
});

app.use('/', routes);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
var env = app.get('env');
if (env === 'development') {
  /* eslint-disable no-unused-vars */
  app.use((err, req, res, next) => {
    /* eslint-enable no-unused-vars */
    res.status(err.status || 500);
    res.render('error.nunj', {
      message: err.message,
      error: err
    });
  });
} else if (env === 'production') {
  // force to redirect to https in production
  console.log('HTTPS');
  app.use(enforce.HTTPS({trustProtoHeader: true}));
}

// production error handler
// no stacktraces leaked to user
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  /* eslint-enable no-unused-vars */
  res.status(err.status || 500);
  res.render('error.nunj', {
    message: err.message,
    error: {}
  });
});


export default app;
