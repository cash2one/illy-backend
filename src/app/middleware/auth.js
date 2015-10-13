/**
 * Created by Frank on 15/6/23.
 */
'use strict';
var jwt = require('jsonwebtoken');
var tokenService = require('../weixin/token');
var config = require('../../config/config');
var cache = require('../common/cache');
var User = require('../models').Student;
var ACCESS_TOKEN_KEY = 'accessToken:kuando';

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
    },


    /**
     * 根据jwt获取用户信息
     * @param next
     */
    getUserByToken: function*(next) {
        var jwtUser = this.state.jwtUser;
        if (!jwtUser || !(jwtUser._id && jwtUser.openid)) {
            this.throw(401, 'Not Authorized');
        }
        var user = yield User.findById(jwtUser._id).exec();
        if (!user) {
            this.throw(400, '不存在学生信息');
        }
        this.request.user = user;
        yield next;

    }
};

module.exports = middleWare;



