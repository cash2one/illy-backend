/**
 *
 * Created by Frank on 15/6/26.
 */
'use strict';

var jwt = require('jsonwebtoken');
var cache = require('../../common/cache');
var config = require('../../../config/config');
var models = require('../../models');
var Visitor = models.Visitor;
var User = models.Student;


var userApi = {
    /**
     * 获取用户信息
     */
    profile: function *() {
        this.body = this.request.user;
    },


    /**
     * 绑定用户微信
     */
    bind: function *() {
        var formUser = this.request.body;
        var openid = formUser.openid;
        if (!openid) {
            this.throw(400, '缺少微信绑定信息');
        }
        if (!formUser || !formUser.username || !formUser.password) {
            this.throw(400, '用户名或者密码不能为空');
        }
        var user = yield User.findOne({username: formUser.username, state: 0}, 'username password schoolId').exec();
        if (!user || !user.authenticate(formUser.password)) {
            this.throw(400, '用户名或密码错误');
        }
        yield User.update({_id: user._id}, {$addToSet: {openids: openid}}).exec();
        var token = jwt.sign({openid: openid, _id: user._id, schoolId: user.schoolId}, config.jwt.secret);
        yield cache.set('openid:' + openid, token, 3600 * 24); //添加缓存24小时
        this.body = token;

    },


    /**
     * 验证用户是否绑定微信
     */
    auth: function *() {
        var weixinToken = this.request.weixinToken;
        var openid = weixinToken.openid;
        var token = yield cache.get('openid:' + openid);
        if (token) {
            this.body = token;
        } else {
            var user = yield User.findOne({openids: openid}, 'schoolId').exec();
            if (!user) {
                user = yield Visitor.findOne({openid: openid}, 'schoolId').exec();
            }
            if (!user) {
                this.throw(401, openid);
            }
            token = jwt.sign({openid: openid, _id: user._id, schoolId: user.schoolId}, config.jwt.secret);
            yield cache.set('openid:' + openid, token, 3600 * 24);
            this.body = token;
        }
    }
};

module.exports = userApi;
