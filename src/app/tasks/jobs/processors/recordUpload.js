/**
 * Created by Frank on 15/7/18.
 */
'use strict';
var co = require('co');
var qn = require('qiniu');
var _ = require('lodash');
var request = require('request-promise');
var api = require('../../../weixin/token');
var config = require('../../../../config/config');

qn.conf.ACCESS_KEY = config.qn.accessKey;
qn.conf.SECRET_KEY = config.qn.secretKey;

var client = qn.rs.Client();

//七牛mps队列
var mps = ['q1amr2mp3', 'q2amr2mp3', 'q3amr2mp3', 'q4amr2mp3'];
/**
 * 将微信服务器的录音抓取至七牛中
 * @param data
 * @param done
 */

/**
 * 获取上传凭证
 * @param key
 */
function getToken(key) {
    var bucket = config.qn.bucket;
    var pfoKey = qn.util.urlsafeBase64Encode(bucket + ':' + key + '.mp3');
    var putPolicy = new qn.rs.PutPolicy2({
        scope: bucket,
        persistentOps: 'avthumb/mp3|saveas/' + pfoKey,
        persistentNotifyUrl: config.apiBaseUrl + '/api/v1/public/qn/persistentNotify',
        persistentPipeline: mps[_.random(0, 3)]
    });
    return putPolicy.token();
}


/**
 * 上传数据
 * @param body
 * @param key
 * @param uptoken
 * @param callback
 */
function uploadBuf(body, key, uptoken, callback) {
    var extr = new qn.io.PutExtra();
    qn.io.put(uptoken, key, body, extr, callback);
}


var uploadTask = co.wrap(function *(data, done) {
    var key = data.key;
    var mediaId = data.mediaId;
    var ret = yield api.getMedia(mediaId);
    var mediaData = ret.data;
    if (ret.error) {
        var msg = JSON.parse(mediaData.toString());
        if (msg.errorcode === 40001) {   //说明accessToken过期，刷新token后重试此任务
            yield api.refreshAccessToken();
        }
        done(new Error(msg.errmsg));
    } else {
        //上传数据
        uploadBuf(mediaData, key, getToken(key), function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    }
});

var doTask = co.wrap(function *(data, done) {
    var key = data.key;
    var mediaId = data.mediaId;
    var accessToken = yield token.getAccessToken();
    var url = `http://api.weixin.qq.com/cgi-bin/media/get?access_token=${accessToken}&media_id=${mediaId}`;

});


module.exports = function (queue) {
    queue.process('qnUpload', function (job, done) {
        uploadTask(job.data, done);
    });
};
