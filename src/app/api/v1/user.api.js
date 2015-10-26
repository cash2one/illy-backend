/**
 *
 * Created by Frank on 15/6/26.
 */
'use strict';

var jwt = require('jsonwebtoken');
var cache = require('../../common/cache');
var config = require('../../../config/config');
var models = require('../../models');
var qn = require('../../qiniu');
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
        var username = formUser.username;
        var password = formUser.password;
        if (!openid) {
            this.throw(400, '缺少微信绑定信息');
        }
        if (!username || !password) {
            this.throw(400, '用户名或者密码不能为空');
        }
        var user = yield User.findOne({username: username, state: 0}, 'username password schoolId').exec();
        if (!user || !user.authenticate(password)) {
            this.throw(400, '用户名或密码错误');
        }
        yield User.update({_id: user._id}, {$addToSet: {openids: openid}}).exec();
        var token = jwt.sign({openid: openid, _id: user._id, schoolId: user.schoolId}, config.jwt.secret);
        yield cache.set('token:user:' + openid, token, 3600 * 24); //添加缓存24小时
        this.body = token;

    },


    /**
     * 验证用户是否绑定微信
     */
    auth: function *() {
        var openid = this.request.openid;
        var type = this.request.query.authType;
        var cacheKey;
        if (type && type === 'visitor') {
            cacheKey = 'token:visitor:' + openid;
        } else {
            cacheKey = 'token:user:' + openid;
        }
        // TODO 添加超时机制
        var token = yield cache.get(cacheKey);
        if (token) {
            this.body = token;
        } else {
            var user;
            if (type && type === 'visitor') {
                user = yield Visitor.findOne({openid: openid}, 'schoolId').exec();
            }
            if (!user) {
                user = yield User.findOne({openids: openid}, 'schoolId').exec();
            }
            if (!user || user === null) {
                this.throw(401, 'User not found : openid [ ' + openid + ' ]');
            }
            token = jwt.sign({openid: openid, _id: user._id, schoolId: user.schoolId}, config.jwt.secret);
            yield cache.set(cacheKey, token, 3600 * 24);
            this.body = token;
        }
    },

    /**
     *
     * 修改个人信息
     *
     */
    update: function *() {
        var user = this.state.jwtUser;
        var userId = user._id;
        this.body = yield User.findByIdAndUpdate(userId, this.request.body, {new: true}).exec();

    },

    /**
     * 修改头像
     *
     */
    avatar: function *() {
        let user = this.state.jwtUser;
        let mediaId = this.request.body.avatar;
        let key = user.schoolId + '/' + mediaId;
        yield qn.fetchFromWeixin(mediaId, key);
        this.body = yield User.update({
            _id: user
        }, {avatar: key}).exec();
    },
    /**
     *
     * 解除绑定
     *
     */
    unbind: function *() {
        var user = this.state.jwtUser;
        var userId = user._id;
        var openid = user.openid;
        // 解除用户绑定
        yield cache.delete('token:user:' + openid);
        yield User.update({_id: userId}, {$pull: {openids: openid}}).exec();
        this.body = openid;
    }
};

module.exports = userApi;
