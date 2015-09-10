'use strict';

var mongoose = require('mongoose'),
    roles = require('../../common/constants').roles,
    crypto = require('crypto'),
    Schema = mongoose.Schema;

/**
 * 学校数据模型Schema
 * @type {Schema}
 */
var schoolSchema = new Schema({

    // 用户名,用户登陆系统所用的名字
    username: {
        type: String,
        trim: true,
        unique: true,
        required: '用户名不能为空',
        index: true
    },

    // 密码
    password: {
        type: String,
        trim: true
    },

    // 加密盐值
    salt: {
        type: String
    },

    // 显示名字,也就是真实姓名
    displayName: {
        type: String,
        trim: true
    },

    // 联系方式
    contact: {
        type: String,
        trim: true,
        required: '联系方式不能为空'
    },

    // 学校名字
    schoolName: {
        type: String,
        trim: true,
        required: '学校名称不能为空'
    },

    // 所在省
    province: {
        type: String,
        trim: true,
        required: '所在省份不能为空'
    },

    // 所在市
    city: {
        type: String,
        trim: true,
        required: '所在城市不能为空'
    },

    // 所在区/县
    area: {
        type: String,
        trim: true
    },

    address: {
        type: String,
        trim: true
    },

    // 规模
    scale: {
        type: Number,
        required: '规模不能为空'
    },

    //二维码url
    qrcode: {
        type: String
    },

    avatar: {
        type: String
    },

    // 是否可用
    state: {
        type: Number,
        enum: [0, 1], //(0:可用 1:禁用)
        default: 0
    },

    // 创建时间
    createdTime: {
        type: Date,
        default: Date.now
    }
});


schoolSchema.pre('save', function (next) {
    if (this.password) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

schoolSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};

schoolSchema.methods.authenticate = function (password) {
    return this.password === this.hashPassword(password);
};

schoolSchema.methods.isDisabled = function () {
    return this.state === 1;
};

schoolSchema.virtual('role').get(function () {
    return roles.HEADMASTER;
});

schoolSchema.virtual('schoolId').get(function () {
    return this._id;
});

schoolSchema.index({province: 1, city: 1, area: 1});

module.exports = {
    School: mongoose.model('School', schoolSchema)
};
