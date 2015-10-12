/**
 *
 * Created by Frank on 15/6/24.
 */

'use strict';
var co = require('co');
var req = require('request-promise');
var config = require('../../config/config');
var cache = require('../common/cache');
var APP_ID = config.weixin.appid;
var APP_SECRET = config.weixin.secret;
var ACCESS_TOKEN_KEY = 'accessToken:kuando';

module.exports = exports = {

    getAuthToken: co.wrap(function* (code) {
        if (!code || code === '') {
            throw(new Error('code can not be empty'));
        }
        let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APP_ID}&secret=${APP_SECRET}&code=${code}&grant_type=authorization_code`;
        let res = yield req({
            uri: url,
            method: 'GET',
            json: true
        });
        if (res.errcode) {
            throw (new Error(res.errmsg));
        }
        return res;

    }),

    /**
     * 获取access token
     * @returns {*}
     */
    getAccessToken: co.wrap(function *() {
        let accessToken = yield cache.get(ACCESS_TOKEN_KEY);
        if (accessToken) {
            return accessToken;
        }
        let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APP_ID}&secret=${APP_SECRET}`;
        let res = yield req({
            uri: url,
            method: 'GET',
            json: true
        });
        if (res.errcode) {
            throw(new Error(res.errmsg));
        }
        accessToken = res.access_token;
        yield cache.set(ACCESS_TOKEN_KEY, accessToken, res.expires_in - 60);  //比官方过期时提前60秒过期
        return accessToken;
    }),


    /**
     *
     *刷新缓存
     *
     */
    refreshToken: co.wrap(function *() {
        yield cache.delete(ACCESS_TOKEN_KEY);  //删除缓存中的token
        return yield exports.getAccessToken();
    }),


    /**
     * 获取页面签名
     */
    getTicket: co.wrap(function *() {
        let accessToken = yield exports.getAccessToken();
        let TICKET_KEY = 'ticket:' + accessToken;
        let ticket = yield cache.get(TICKET_KEY);
        if (ticket) {
            return ticket;
        }
        let url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`;
        let res = yield req({
            uri: url,
            method: 'GET',
            json: true
        });
        if (res.errcode !== 0) {
            if (res.errcode === 40001) {
                yield cache.delete(ACCESS_TOKEN_KEY);  //说明accessToken已经过期失效
                return yield exports.getTicket();  //再次调用
            }
            throw (new Error(res.errmsg));
        }
        ticket = res.ticket;
        cache.set(TICKET_KEY, ticket, res.expires_in - 60);
        return ticket;
    })

};
