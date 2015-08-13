'use strict';
/**
 * 题库模型
 * @type {*|exports|module.exports}
 */

var mongoose = require('mongoose');
var _ = require('lodash');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var exerciseSchema = new Schema({
    // 习题类型 (choice and completion)
    _id: {
        type: Number
    },
    eType: {
        type: Number,
        enum: [0, 1, 2, 3] // (0: 单选 1: 图片单选  2:填空  3: 语音)
    },
    // 序号
    sequence: {
        type: Number
    },
    // 说明
    description: {
        type: String
    },
    // 题干
    question: {
        type: String
    },
    //用于选择题
    choices: [{
        title: String,
        content: String,
        _id: false
    }],
    // 答案
    answer: {
        type: String
    },
    // 答案解析
    analysis: {
        type: String
    }
});

exerciseSchema.pre('save', function (next) {
    // do stuff\
    this._id = this.sequence;
    next();
});

/**
 * 题库数据模型Schema
 * @type {Schema}
 */
var quizSchema = new Schema({
    // 题目名称
    title: {
        type: String
    },
    // 习题列表(关联习题)
    exercises: [exerciseSchema],

    // 创建人
    creator: {
        type: ObjectId,
        ref: 'Teacher',
        index: true
    },
    creatorDisplayName: {
        type: String
    },
    creatorUsername: {
        type: String
    },
    tags: {
        type: [String],
        index: true
    },
    // 创建时间
    createdTime: {
        type: Date,
        default: Date.now
    },

    usage: {
        type: Number,
        default: 0
    },
    // 学校id
    schoolId: {
        type: ObjectId,
        index: true
    }
});

module.exports = {Quiz: mongoose.model('Quiz', quizSchema)};
