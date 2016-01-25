/**
 * Created by Frank on 15/6/23.
 */
'use strict';
var User = require('../models').Student;

var middleWare = {
    /**
     * 根据jwt获取用户信息
     * @param next
     */
    getUserByToken: function*(next) {
        var jwtUser = this.state.jwtUser;
        if (!jwtUser || !(jwtUser._id)) {
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



