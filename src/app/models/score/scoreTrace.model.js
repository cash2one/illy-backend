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
        type: String,
        required: '操作不能为空'
    },
    // 分值
    value: {
        type: Number,
        required: '分值不能为空'
    },
    reason: {
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
        required: true
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
    ScoreTrace: mongoose.model('ScoreTrace', scoreTraceSchema)
};

