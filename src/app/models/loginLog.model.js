'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


var loginLogSchema = new Schema({
    created: {
        type: Date
    },
    count: {
        type: Number
    },
    role: {
        type: Number,
        enums: [0, 1, 2]  //1:老师 2:学生
    },
    schoolId: {
        type: ObjectId,
        index: true
    }
});
loginLogSchema.index({created: 1}, {expireAfterSeconds: 3600 * 24 * 60});  // 设置60天数据过期

module.exports = {LoginLog: mongoose.model('LoginLog', loginLogSchema)};
