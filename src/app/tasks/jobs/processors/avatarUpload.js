/**
 * Created by Frank on 15/7/18.
 */
'use strict';
var co = require('co');
var qn = require('qiniu');
var _ = require('lodash');
var request = require('request-promise');
var api = require('../../../weixin/api');
var config = require('../../../../config/config');

qn.conf.ACCESS_KEY = config.qn.accessKey;
qn.conf.SECRET_KEY = config.qn.secretKey;

/**
 * 将上传的头像抓取至七牛中
 * @param data
 * @param done
 */

/**
 * 获取上传凭证
 */
function getToken() {
    var bucket = config.qn.bucket;
    var putPolicy = new qn.rs.PutPolicy2({
        scope: bucket,
        callbackUrl: 'http://api.hizuoye.com/api/v1/public/qn/avatarUploaded',
        callbackBody: 'key=$(key)&student=$(x:student)'
    });
    return putPolicy.token();
}


/**
 * 上传数据
 * @param data
 * @param callback
 */
function doUpload(data, callback) {
    var extra = new qn.io.PutExtra();
    extra.params = data.params;
    qn.io.put(getToken(), data.key, data.body, extra, callback);
}

var uploadTask = co.wrap(function *(data, done) {
    var key = data.key;
    var mediaId = data.mediaId;
    var ret = yield api.getMedia(mediaId);
    if (ret.error) {
        var msg = JSON.parse(ret.data.toString());
        if (msg.errorcode === 40001) {   //说明accessToken过期，刷新token后重试此任务
            yield api.refreshAccessToken();
        }
        done(new Error(msg.errmsg));
    } else {
        //上传数据
        var upData = {
            body: ret.data,
            key: key,
            params: {
                'x:student': data.student
            }
        };
        doUpload(upData, function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    }
});

module.exports = function (queue) {
    queue.process('avatarUpload', function (job, done) {
        uploadTask(job.data, done);
    });
};
