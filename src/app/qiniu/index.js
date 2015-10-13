/**
 *
 * Created by Frank on 15/10/12.
 */
'use strict';

var qiniu = require('qiniu');
var config = require('../../config/config').qn;
var mps = ['q1amr2mp3', 'q2amr2mp3', 'q3amr2mp3', 'q4amr2mp3'];
var mpsTimes = 0;

qiniu.conf.ACCESS_KEY = config.accessKey;
qiniu.conf.SECRET_KEY = config.secretKey;
qiniu.conf.bucket = config.bucket;


module.exports = {
    config: config,
    /**
     * 抓取资源
     * @param url
     * @param key
     * @param callback
     */
    fetch: function (url, key, callback) {
        let client = new qiniu.rs.Client();
        client.fetch(url, config.bucket, key, callback);
    },

    /**
     * 转码
     * @param key
     * @param fops
     * @param options
     * @param callback
     */
    pfop: function (key, fops, options, callback) {
        let opts = {};
        let cb = callback;
        if (arguments.length === 3) {
            cb = options;
        } else {
            opts = options;
        }
        opts.force = 1;
        opts.pipeline = mps[mpsTimes % (mps.length - 1)];
        mpsTimes = mpsTimes > 1000 ? 0 : mpsTimes + 1;
        qiniu.fop.pfop(config.bucket, key, fops, opts, cb);
    },
    util: qiniu.util
};




