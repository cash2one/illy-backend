'use strict';
/**
 * Module dependencies.
 */
var promiseFactory = require('q').Promise,
  config = require('../config/config');


var Redis = require('ioredis'),
  redisConfig = config.redis;

var retryStrategy = function (times) {
  return Math.min(times * 2, 2000);
};


var redisClient = new Redis({
  host: redisConfig.host,
  port: redisConfig.port,
  password: redisConfig.options.auth_pass
});


redisClient.on('error', function (err) {
  console.error(err);
});

redisClient.on('connect', function () {
  console.log('redis connect successfully');
});

redisClient.on('closed', function () {
  console.warn('redis has closed');
});

redisClient.on('reconnecting', function (times) {
  console.warn('redis reconnecting ' + times + ' times');
  if (times > 500) {
    console.error('process exit because of redis reconnecting');
    process.exit(-1);
  }
});
module.exports = redisClient;
