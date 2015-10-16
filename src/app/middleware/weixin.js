/**
 * Created by Frank on 15/6/23.
 */
'use strict';
var tokenService = require('../weixin/token');
var middleWare = {

    /**
     * 获取微信openid token中间件
     * @param next
     */
    getOpenidToken: function*(next) {
        let code = this.request.query.code || this.request.body.code;
        try {
            let token = yield tokenService.getAuthToken(code);
            this.request.openid = token.openid;
        }
        catch (err) {
            this.throw(400, err);
        }
        yield next;
    },


    /**
     * 获取微信 access token
     * @param next
     */
    getAccessToken: function*(next) {
        try {
            this.request.accessToken = yield tokenService.getAccessToken();
        } catch (err) {
            this.throw(400, err);
        }
        yield next;
    },

    /**
     *  获取 jsapi_ticket
     * @param next
     */
    getTicket: function*(next) {
        try {
            this.request.ticket = yield tokenService.getTicket();
        } catch (err) {
            this.throw(400, err);
        }
        yield next;
    }

};

module.exports = middleWare;



