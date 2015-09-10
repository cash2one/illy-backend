/**
 * Created by Frank on 15/9/3.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var performanceSchema = new Schema({

    // 学生
    student: {
        type: ObjectId,
        ref: 'Student',
        required: true
    },

    // 花费秒数
    spendSeconds: {
        type: Number,
        default: 0
    },

    // 错误答案
    wrongCollect: [{
        sequence: Number,
        answer: String,
        _id: false
    }],

    // 录音题答案
    audioAnswers: [{
        sequence: Number,
        answer: String,
        _id: false
    }],


    // 奖励积分数
    award: {
        type: Number,
        default: 0
    },

    // 评论
    comment: {
        teacher: {
            type: ObjectId,
            ref: 'Teacher'
        },
        content: {
            type: String
        }
    },

    finishedTime: {
        type: Date
    },

    // 状态
    state: {
        type: Number,
        enum: [0, 1, 2],  //0:未做  1:已做 2:已检查
        default: 0
    }

}, {_id: false});


var homeworkSchema = new Schema({

    // 练习ID
    quiz: {
        type: ObjectId,
        ref: 'Quiz',
        required: true
    },

    // 作业标题
    title: {
        type: String,
        required: true
    },

    // 知识重点
    keyPoint: {
        type: String
    },

    //知识重点录音
    keyPointRecord: {
        type: String
    },

    // 作业完成奖励
    finishAward: {
        type: Number,
        default: 0
    },

    // 成绩奖励
    performanceAward: {
        type: Number,
        default: 0
    },

    //练习题目数量
    exerciseCount: Number,

    //班级ID
    clazz: {
        type: ObjectId,
        ref: 'Class',
        required: true
    },

    state: {
        type: Number,
        enum: [0, 1, 2], //0 待检查  1:已关闭  2:已删除
        default: 0
    },

    performances: [performanceSchema],

    // 统计数据
    statistics: {
        // 做此次作业的学生数量
        studentCount: Number,
        // 完成此次作业的学生数量
        studentCountOfFinished: {
            type: Number,
            default: 0
        },
        // 平均完成时间
        averageSpendSeconds: {
            type: Number,
            default: 0
        },
        // 完成率
        finishRate: {
            type: Number,
            default: 0
        },
        // 错误率
        wrongRate: {
            type: Number,
            default: 0
        }
    },

    createdTime: {
        type: Date,
        default: Date.now
    },

    schoolId: {
        type: ObjectId,
        required: true
    }
});

homeworkSchema.index({clazz: 1, state: 1});
module.exports = {
    Homework: mongoose.model('Homework', homeworkSchema)
};
