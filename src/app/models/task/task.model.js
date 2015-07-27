/**
 *
 * Created by Frank on 15/7/20.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var taskSchema = new Schema({

    name: {              // 任务名称
        type: String,
        required: true
    },

    taskType: {
        type: Number,
        enum: [0, 1],    // 0: 文章分享 1: 活动分享
        require: true
    },

    item: {              // 任务具体内容ID
        type: ObjectId,
        require: true
    },

    state: {             // 任务状态 0: 进行中 1: 结束
        type: Number,
        enum: [0, 1, 2],
        default: 0
    },

    scoreAward: {       // 奖励积分数
        type: Number,
        default: 0
    },

    partner: {         // 参与者范围 ：默认是 all
        type: String,
        default: 'all'
    },

    participants: {    // 参加此次任务的数量
        type: Number,
        default: 0
    },

    shareCount: {      // 此次任务分享人数 针对分享类任务
        type: Number,
        default: 0
    },

    visitCount: {     // 查看此次任务的人数
        type: Number,
        default: 0
    },

    created: {
        type: Date,
        default: Date.now
    },

    schoolId: {
        type: ObjectId,
        require: true
    }
});

taskSchema.post('remove', function (task) {
    var TaskRecord = mongoose.model('TaskRecord');
    TaskRecord.remove({
        task: task
    }, function (err) {
        if (err) {
            console.error(err);
        }
    });
});

module.exports = {
    Task: mongoose.model('Task', taskSchema)
};

