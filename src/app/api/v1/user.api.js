/**
 *
 * Created by Frank on 15/6/26.
 */
'use strict';

var jwt = require('jsonwebtoken');
var config = require('../../../config/config');
var models = require('../../models');
var qn = require('../../qiniu');
var Visitor = models.Visitor;
var User = models.Student;
var School = models.School;

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
        let formUser = this.request.body;
        let openid = formUser.openid;
        let username = formUser.username;
        let password = formUser.password;
        if (!username || !password) {
            this.throw(400, '用户名或者密码不能为空');
        }
        let user = yield User.findOne({username: username, state: 0})
            .select('username password schoolId').exec();

        if (!user || !user.authenticate(password)) {
            this.throw(400, '用户名或密码错误');
        }
        let signInfo = {_id: user._id, schoolId: user.schoolId};
        if (openid) {
            signInfo.openid = openid;
            user.openids.addToSet(openid);
            yield user.save();
        }
        this.body = jwt.sign(signInfo, config.jwt.secret);
    },


    /**
     * 验证用户是否绑定微信
     */
    auth: function *() {
        let openid = this.request.openid;
        let type = this.query.authType;
        let schoolNum = this.query.school;
        let token;
        let user;
        //如果存在schoolNum说明是查看微网站
        if (schoolNum) {
            let school = yield School.findOne({username: schoolNum}).select('_id').lean().exec();
            if (!school) {
                this.throw(400, 'School not exist : ', schoolNum);
            }
            return this.body = jwt.sign({schoolId: school._id.toString()});
        }

        if (!openid) {
            this.throw(400, 'openid not found');
        }

        if (type && type === 'visitor') {
            user = yield Visitor.findOne({openid: openid}, 'schoolId').exec();
        }
        if (!user || user === null) {
            user = yield User.findOne({openids: openid}, 'schoolId').exec();
        }

        if (!user || user === null) {
            this.throw(401, 'User not found : openid [ ' + openid + ' ]');
        }
        token = jwt.sign({openid: openid, _id: user._id, schoolId: user.schoolId}, config.jwt.secret);
        this.body = token;
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
        if (!openid) {
            return this.body = "";
        }
        yield User.update({_id: userId}, {$pull: {openids: openid}}).exec();
        this.body = openid;
    }
};

module.exports = userApi;
