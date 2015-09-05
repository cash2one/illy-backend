'use strict';
/**
 * 家庭作业模型
 * @type {*|exports|module.exports}
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var exerciseSchema = new Schema({
    // 习题类型 (choice and completion)
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
}, {_id: false});


var quizSchema = new Schema({

    title: {
        type: String,
        required: '作业标题不能为空'
    },


    // 创建人
    creator: {
        type: ObjectId,
        ref: 'Teacher',
        index: true
    },

    //题目列表
    exercises: [exerciseSchema],

    createdTime: {
        type: Date,
        default: Date.now
    },

    // 是否保存题库
    asTemplate: {
        type: Boolean,
        default: true
    },
    // 使用次数

    usage: {
        type: Number,
        default: 0
    },

    schoolId: {
        type: ObjectId,
        index: true
    }
});


module.exports = {
    Quiz: mongoose.model('Quiz', quizSchema)
};

