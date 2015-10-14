/**
 * Koa config
 */

'use strict';

var cors = require('koa-cors');
var jwt = require('koa-jwt');
var bodyParser = require('koa-bodyparser');
var config = require('./config');
var weixinProxy = require('../app/weixin/proxy');
var logger = require('../app/middleware/logger');

module.exports = function (app) {
    //loading data models
    require('../app/models');

    //for slb heath check
    app.use(function*(next) {
        if (this.request.url === '/ping') {
            return this.body = 'ok';
        }
        yield next;
    });

    //handle weixin event and msg
    app.use(weixinProxy());

    app.use(bodyParser());

    //cors settings
    app.use(cors({
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type, Authorization',
        'Access-Control-Max-Age': 1728000
    }));

    if (config.debug) {
        app.use(logger.debug);
    }

    app.on('error', function (err) {
        console.error(err);
    });

    // jwt token
    app.use(jwt(config.jwt).unless({path: [/^\/api\/v1\/public/]}));

    //loading routes
    require('../app/routes')(app);

};
