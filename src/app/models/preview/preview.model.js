'use strict';
/**
 * 家庭作业模型
 * @type {*|exports|module.exports}
 */

var mongoose = require('mongoose');
var states = require('../../common/constants').states;
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var exerciseSchema = new Schema({
    // 习题类型 (choice and completion)
    _id: {
        type: Number
    },
    eType: {
        type: Number,
        default: 3// (0: 单选 1: 图片单选  2:填空  3: 语音)
    },
    // 序号
    sequence: {
        type: Number
    },
    // 题干
    question: {
        type: String
    },
    // 答案
    answer: {
        type: String
    }
});

var performanceSchema = new Schema({
    // 当前做题的学生
    student: {
        type: ObjectId,
        index: true,
        ref: 'Student'
    },
    state: {
        type: Number,
        enum: [0, 1, 2],  //0:未做  1:已做 2:已检查
        default: 0
    },
    // 花费秒数
    spendSeconds: {
        type: Number
    },
    // 录音题答案
    audioAnswers: [{
        exerciseId: Number,
        answer: String
    }],
    // 评语
    comment: {
        type: String,
        trim: true
    }
}, {_id: false});


var previewSchema = new Schema({
    assignedClass: {
        type: ObjectId,
        ref: 'Class'
    },
    className: {
        type: String
    },
    title: {
        type: String,
        required: '预习标题不能为空'
    },
    // 知识重点
    keyPoint: {
        type: String
    },
    //知识重点录音
    keyPointRecord: {
        type: String
    },
    state: {
        type: Number,
        enum: [0, 1], // 0 未结束  1 未结束
        default: 0
    },
    // 创建人
    creator: {
        type: ObjectId,
        ref: 'Teacher',
        index: true
    },
    // 开始时间
    startTime: {
        type: Date
    },
    // 结束时间
    endTime: {
        type: Date
    },

    //题目列表
    exercises: [exerciseSchema],

    // 学生成绩列表
    performances: [performanceSchema],

    // 做此次作业的学生数量
    studentCount: Number,

    // 完成此次作业的学生数量
    studentCountOfFinished: Number,

    // 统计数据
    statistics: {
        finishRate: Number,

        studentCount: Number,
        // 完成此次作业的学生数量
        studentCountOfFinished: Number
    },

    createdTime: {
        type: Date,
        default: Date.now
    },

    schoolId: {
        type: ObjectId,
        index: true
    }
});

previewSchema.index({assignedClass: 1, state: 1});

module.exports = {
    Preview: mongoose.model('Preview', previewSchema)
};

