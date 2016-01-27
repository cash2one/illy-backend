'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

/**
 * 积分操作流水
 * @type {*|Schema}
 *
 */
var scoreTraceSchema = new Schema({
    // 操作
    operation: {
        type: Number,
        enum: [0, 1],  //0 添加  1删除
        required: '操作不能为空'
    },
    // 分值
    value: {
        type: Number,
        required: '分值不能为空'
    },

    remark: {
        type: String
    },

    student: {
        type: ObjectId,
        ref: 'Student',
        index: true,
        required: true
    },

    operator: {
        type: ObjectId,
        ref: 'Teacher'
    },

    createdTime: {
        type: Date,
        default: Date.now
    },

    schoolId: {
        type: ObjectId,
        index: true,
        required: true
    }

});

module.exports = {
    ScoreTrace: mongoose.model('ScoreLog', scoreTraceSchema)
};

