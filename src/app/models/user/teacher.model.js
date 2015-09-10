/**
 * Created by Frank on 14/11/20.
 */
'use strict';
var mongoose = require('mongoose'),
    roles = require('../../common/constants').roles,
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var teacherSchema = new Schema({
    // 用户名,用户登陆系统所用的名字
    username: {
        type: String,
        trim: true,
        index: true,
        required: '教师工号不能为空',
        unique: true
    },
    //密码
    password: {
        type: String,
        trim: true

    },
    // 姓名
    displayName: {
        type: String,
        trim: true
    },
    // 微信号
    weixin: {
        type: String
    },
    // 二维码
    qrcode: {
        type: String
    },
    // 头像
    avatar: {
        type: String,
        default: ''
    },
    // 联系方式
    contact: {
        type: String,
        trim: true
    },
    // 部门
    department: {
        type: String,
        trim: true
    },
    // 状态
    state: {
        type: Number,
        enum: [0, 1],
        default: 0
    },

    // 创建时间
    createdTime: {
        type: Date,
        default: Date.now
    },
    // 关联的学校
    schoolId: {
        type: ObjectId,
        index: true
    }
});

teacherSchema.virtual('role').get(function () {
    return roles.TEACHER;
});

teacherSchema.methods.authenticate = function (password) {
    return this.password === password;
};

teacherSchema.methods.isDisabled = function () {
    return this.state === 1;
};

teacherSchema.index({schoolId: 1, state: 1});


module.exports = {
    Teacher: mongoose.model('Teacher', teacherSchema)
};





