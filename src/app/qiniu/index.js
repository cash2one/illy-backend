/**
 *
 * Created by Frank on 15/10/12.
 */
'use strict';

var qiniu = require('qiniu');
var thunkify = require('thunkify');
var co = require('co');
var config = require('../../config/config').qn;
var tokenService = require('../weixin/token');
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
    fetch: thunkify(function (url, key, callback) {
        let client = new qiniu.rs.Client();
        client.fetch(url, config.bucket, key, callback);
    }),


    /**
     * 从微信服务器抓取资源
     */
    fetchFromWeixin: co.wrap(function *(mediaId, key) {
        let accessToken = yield tokenService.getAccessToken();
        let client = new qiniu.rs.Client();
        let url = `http://api.weixin.qq.com/cgi-bin/media/get?access_token=${accessToken}&media_id=${mediaId}`;
        let hasTried = false;
        while (true) {
            let res = yield thunkify(client.fetch)(url, config.bucket, key);
            if (res.mimeType !== 'text/html') {
                return res;
            }
            if (hasTried) {
                throw new Error('Fetch from weixin failed!');
            }
            yield token.refreshToken();
            hasTried = true;
        }
    }),


    /**
     * 转码
     * @param key
     * @param fops
     * @param options
     * @param callback
     */
    pfop: thunkify(function (key, fops, options, callback) {
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
    }),

    util: qiniu.util
}
;




