/**
 * Koa config
 */

'use strict';

var cors = require('koa-cors'),
  requireDir = require('require-dir'),
  _ = require('lodash'),
  morgan = require('koa-morgan'),
  jwt = require('koa-jwt'),
  bodyParser = require('koa-bodyparser'),
  xmlParser = require('../app/weixin/xmlParser'),
  config = require('./config'),
  logger = require('./logger'),
  receiverProxy = require('../app/weixin/proxy');

module.exports = function (app) {

  //loading data models
  requireDir('../app/models', {recurse: true});

  //parser weixin xml msg
  app.use(xmlParser());

  //handle weixin event and msg
  app.use(receiverProxy());

  app.use(bodyParser());

  //cors settings
  app.use(cors({
    'Access-Control-Allow-Headers': 'X-Requested-With,content-type, Authorization',
    'Access-Control-Max-Age': 1728000
  }));

  // mogan settings
  app.use(morgan.middleware(logger.getLogOptions(), logger.getLogFormat()));

  // error handler
  app.use(function *(next) {
    try {
      yield next;
    } catch (err) {
      switch (err.status) {
        case 401:
          this.status = 401;
          this.body = err.message;
          break;
        case 400:
          this.status = 400;
          this.body = {error: err.message};
          break;
        case 404:
          this.status = 404;
          this.body = {
            info: 'illy api',
            docUrl: config.docUrl
          };
          break;
        default :
          throw err;
      }
    }
  });

  // jwt token
  app.use(jwt(config.jwt).unless({path: [/^\/api\/v1\/public/]}));

  //loading routes
  require('../app/routes')(app);

  // handler 404
  app.use(function *() {
    this.throw(404, 'Resource Not Found');
  });

};
