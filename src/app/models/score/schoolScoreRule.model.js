'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 *
 * 学校自定义积分规则
 * @type {*|Schema}
 */
var schoolScoreRuleSchema = new Schema({

    // 规则标示
    key: {
        type: Number,
        required: true
    },

    // 执行操作的分值
    value: {
        type: Number,
        required: true,
        default: 0
    },

    schoolId: {
        type: ObjectId,
        required: true,
        index: true
    },

    createdTime: {
        type: Date,
        default: Date.now
    }
});

module.exports = {
    SchoolScoreRule: mongoose.model('SchoolScoreRule', schoolScoreRuleSchema)
};
