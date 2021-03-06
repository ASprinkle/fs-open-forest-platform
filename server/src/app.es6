'use strict';

/**
 * Module for FS Intake API Server
 * @module app
 */
const logger = require('./services/logger.es6');
const vcapConstants = require('./vcap-constants.es6');
if (!vcapConstants.isLocalOrCI) {
  logger.info(`Activating New Relic: ${vcapConstants.NEW_RELIC_APP_NAME}`);
  require('newrelic'); // eslint-disable-line global-require
} else {
  logger.warn('Skipping New Relic Activation');
}

const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const session = require('cookie-session');
const moment = require('moment');

const passportConfig = require('./auth/passport-config.es6');
const router = require('./routers/router.es6');
const util = require('./services/util.es6');
const payGovMocks = require('./mocks/pay-gov-mocks.es6');
const loginGovMocks = require('./mocks/login-gov-mocks.es6');
require('body-parser-xml')(bodyParser);
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const loggerParams = { json: true, colorize: true, timestamp: true };
const expressWinston = require('express-winston');
var Keygrip = require('keygrip');

// Create the express application.
const app = express();

vcapConstants.nodeEnv = process.env.NODE_ENV;

/** Use helmet for increased security. */
app.use(helmet());

/** Body parsers are necessary for restful JSON and passport. */
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(bodyParser.xml());

/** Logging middleware */
expressWinston.requestWhitelist = ['url',
  'headers.host',
  'headers.user-agent',
  'method',
  'httpVersion',
  'originalUrl',
  'referer',
  'responseTime'
];

if (logger.levels[logger.level] >= 2) {
  app.use(expressWinston.logger({
    transports: [
      new logger.transports.Console(loggerParams)
    ],
    bodyWhitelist: ['forestID', 'region', 'forest', 'type']
  }));
}

app.use(expressWinston.errorLogger({
  transports: [
    new logger.transports.Console(loggerParams)
  ]
}));

/**  Cookies for session management. */
app.use(
  session({
    name: 'session',
    keys: new Keygrip([vcapConstants.PERMIT_SECRET], 'sha256', 'base64'),
    cookie: {
      secure: true,
      httpOnly: true,
      domain: vcapConstants.BASE_URL,
      expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    }
  })
);

/** set meridiem format to a.m. and p.m. */
moment.updateLocale('en', {
  meridiem(hour, minute, isLowerCase) {
    return hour < 12 ? 'a.m.' : 'p.m.';
  }
});
/** Configure passport for login.gov and eAuth. */
passportConfig.setup(app);

/** Pay.gov mock route */
if (util.isLocalOrCI()) {
  app.use(payGovMocks.router);
}
app.use(loginGovMocks.router);

/** serve up docs api */
app.use('/docs/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/** Add the routes. */
app.use(router);

/** Listen on port. */
app.listen(process.env.PORT || 8080, () => {
  logger.info('Express server initiated');
});

module.exports = app;
