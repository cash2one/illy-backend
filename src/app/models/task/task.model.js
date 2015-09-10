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
        required: true
    },

    item: {              // 任务具体内容ID
        type: ObjectId,
        required: true
    },

    state: {             // 任务状态  0:进行中 1: 结束 2:删除
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

    createdTime: {
        type: Date,
        default: Date.now
    },

    schoolId: {
        type: ObjectId,
        required: true
    }
});

taskSchema.index({schoolId: 1, state: 1});

taskSchema.pre('remove', function (task) {
    var TaskRecord = mongoose.model('TaskRecord');
    TaskRecord.remove({
        task: task
    }, function (err) {
        if (err) {
            console.error(err);
        }
    });
    if (task.taskType === 1) {
        var Activity = mongoose.model('Activity');
        Activity.remove({task: task}, function (err) {
            if (err) console.error(err);
        });
    }
});


module.exports = {
    Task: mongoose.model('Task', taskSchema)
};

