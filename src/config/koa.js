/**
 * Koa config
 */

'use strict';

var cors = require('koa-cors');
var _ = require('lodash');
var morgan = require('koa-morgan');
var jwt = require('koa-jwt');
var bodyParser = require('koa-bodyparser');
var xmlParser = require('../app/weixin/xmlParser');
var config = require('./config');
var receiverProxy = require('../app/weixin/proxy');

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
    app.use(receiverProxy());

    app.use(bodyParser());

    //cors settings
    app.use(cors({
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type, Authorization',
        'Access-Control-Max-Age': 1728000
    }));

    app.use(function *(next) {
        if (config.debug) {
            console.log(this.request.method + ':', this.request.url);
            if (this.request.method === 'GET') {
                console.log('Request:', this.request.query);
            } else {
                console.log('Request: ', this.request.body);
            }
        }
        yield next;
        if (config.debug) {
            console.log('Response: ', this.body);
        }
    });

    app.on('error', function (err) {
        console.error(err);
    });

    // jwt token
    app.use(jwt(config.jwt).unless({path: [/^\/api\/v1\/public/]}));

    //loading routes
    require('../app/routes')(app);

};
