/**
 * Created by Frank on 15/6/29.
 */
'use strict';

var redis = require('../../db/redis');

/**
 *
 * @param key
 * @param value
 * @param expire 过期秒数
 */

var cache = {
    set: function (key, value, expire) {
        if (expire) {
            return redis.setex(key, expire, value);
        }
        return redis.set(key, value);
    },

    get: function (key) {
        return redis.get(key);
    },

    delete: function (key) {
        return redis.del(key);
    }
};

module.exports = cache;

