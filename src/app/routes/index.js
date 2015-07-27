/**
 *
 * Created by Frank on 15/6/23.
 */

'use strict';
var requireDir = require('require-dir'),
  mount = require('koa-mount'),
  _ = require('lodash');

module.exports = function (app) {
  var api = require('koa-router')();
  // load routes in api directory
  _.forEach(requireDir('./api'), function (route) {
    route(api);
  });

  app.use(mount('/api/v1', api.routes()));

};
