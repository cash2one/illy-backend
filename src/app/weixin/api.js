/**
 *
 * Created by Frank on 15/6/24.
 */

'use strict';
var config = require('../../config/config'),
    co = require('co'),
    req = require('request-promise'),
    http = require('http'),
    cache = require('../common/cache'),
    APPID = config.weixin.appid,
    APPSECRET = config.weixin.secret;

var ACCESS_TOKEN_KEY = 'accessToken:kuando';

var getOpenidToken = function (code) {
    var url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APPID}&secret=${APPSECRET}&code=${code}&grant_type=authorization_code`;
    return req({
        uri: url,
        method: 'GET',
        json: true
    });

};

/**
 * 获取access token
 * @returns {*}
 */
var getAccessToken = co.wrap(function *() {
    var accessToken = yield cache.get(ACCESS_TOKEN_KEY);
    if (accessToken) {
        return accessToken;
    }
    var url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`;
    var res = yield req({
        uri: url,
        method: 'GET',
        json: true
    });
    if (res.errcode) {
        throw(new Error(res.errmsg));
    } else {
        accessToken = res.access_token;
        yield cache.set(ACCESS_TOKEN_KEY, accessToken, res.expires_in - 60);  //比官方过期时提前60秒过期
    }
    return accessToken;
});

/**
 *
 *刷新缓存
 *
 */
var refreshToken = co.wrap(function *() {
    yield cache.delete(ACCESS_TOKEN_KEY);  //删除缓存中的token
    yield getAccessToken();
});

var getTicket = co.wrap(function *() {
    var accessToken = yield getAccessToken();
    var TICKET_KEY = 'ticket:' + accessToken;
    var ticket = yield cache.get(TICKET_KEY);
    if (ticket) {
        return ticket;
    }
    var url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`;
    var res = yield req({
        uri: url,
        method: 'GET',
        json: true
    });
    if (res.errcode !== 0) {
        if (res.errcode === 40001) {
            yield cache.delete(ACCESS_TOKEN_KEY);  //说明accessToken已经过期失效
            return yield getTicket();  //再次调用
        }
        throw (new Error(res.errmsg));
    }
    ticket = res.ticket;
    cache.set(TICKET_KEY, ticket, res.expires_in - 60);
    return ticket;
});


var getQrcode = co.wrap(function *(postData) {
    var accessToken = yield getAccessToken();
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
    var accessToken = yield getAccessToken();
    var url = `http://api.weixin.qq.com/cgi-bin/media/get?access_token=${accessToken}&media_id=${mediaId}`;
    return yield new Promise(function (resolve, reject) {
        http.get(url, function (res) {
            var ret = {};
            var error = res.headers['content-type'] === 'text/plain';
            var chunks = [],
                size = 0;
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


module.exports = {
    refreshAccessToken: refreshToken,
    getAccessToken: getAccessToken,
    getTicket: getTicket,
    getOpenidToken: getOpenidToken,
    getQrcode: getQrcode,
    getMedia: getMedia
};
