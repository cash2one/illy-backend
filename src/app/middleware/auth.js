/**
 * Created by Frank on 15/6/23.
 */
'use strict';
var jwt = require('jsonwebtoken');
var api = require('../weixin/api');
var config = require('../../config/config');
var cache = require('../common/cache');
var User = require('../models').Student;
var ACCESS_TOKEN_KEY = 'accessToken:kuando';

/**
 * 获取微信openid token中间件
 * @param next
 */
exports.getOpenidToken = function*(next) {
  var code = this.request.query.code || this.request.body.code;
  if (!code) {
    this.throw(400, '微信验证码不能为空');
  }
  var res = yield api.getOpenidToken(code);
  if (res.errcode) {
    this.throw(400, res.errmsg);
  }
  this.request.weixinToken = res;
  yield next;
};


/**
 * 获取微信 access token
 * @param next
 */
exports.getAccessToken = function*(next) {
  this.request.accessToken = yield api.getAccessToken;
  yield next;
};

/**
 *  获取 jsapi_ticket
 * @param next
 */
exports.getTicket = function*(next) {
  this.request.ticket = yield api.getTicket;
  yield next;
};


/**
 * 根据jwt获取用户信息
 * @param next
 */
exports.getUserByToken = function*(next) {
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

};



