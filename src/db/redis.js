'use strict';
/**
 * Module dependencies.
 */

var config = require('../config/config');


var Redis = require('ioredis');


var redisClient = new Redis(config.redis);


redisClient.on('error', function (err) {
    console.error(err);
});

redisClient.on('connect', function () {
    console.log('redis connect successfully');
});

redisClient.on('closed', function () {
    console.warn('redis has closed');
});

module.exports = redisClient;
