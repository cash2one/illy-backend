/**
 * Created by Frank on 15/6/29.
 */

var redis = require('../../db/redis');

/**
 *
 * @param key
 * @param value
 * @param expire 过期秒数
 */
exports.set = function (key, value, expire) {
  if (expire) {
    return redis.setex(key, expire, value);
  }
  return redis.set(key, value);
};


exports.get = function (key) {
  return redis.get(key);
};


exports.delete = function (key) {
  return redis.del(key);
};

