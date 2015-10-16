/**
 *
 * Created by Frank on 15/6/24.
 */


'use strict';
var co = require('co');
var req = require('request-promise');
var http = require('http');
var token = require('./token');

var getQrcode = co.wrap(function *(postData) {
    var accessToken = yield token.getAccessToken();
    var url = `https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${accessToken}`;
    var options = {
        uri: url,
        method: 'POST',
        json: true,
        body: postData
    };
    return yield req(options);

});

var getMedia = co.wrap(function* (mediaId) {
    var accessToken = yield token.getAccessToken();
    var url = `http://api.weixin.qq.com/cgi-bin/media/get?access_token=${accessToken}&media_id=${mediaId}`;
    return yield new Promise(function (resolve, reject) {
        http.get(url, function (res) {
            var ret = {};
            var error = res.headers['content-type'] === 'text/plain';
            var chunks = [];
            var size = 0;
            res.on('data', function (data) {
                chunks.push(data);
                size += data.length;
            }).
                on('end', function () {
                    ret.data = Buffer.concat(chunks, size);
                    ret.error = error;
                    resolve(ret);
                }).
                on('error', function (err) {
                    reject(err);
                });
        });
    });
});


var sendMessage = co.wrap(function *(to, content) {
    let postData = {
        "touser": to,
        "msgtype": "text",
        "text": {
            "content": content
        }
    };
    let accessToken = yield token.getAccessToken();
    let url = `https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${accessToken}`;
    yield req({
        url: url,
        method: 'POST',
        json: true,
        body: postData
    });
});

module.exports = {
    sendMessage: sendMessage,
    getQrcode: getQrcode,
    getMedia: getMedia
};
