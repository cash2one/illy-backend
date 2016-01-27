/**
 * Created by Frank on 15/7/27.
 */

'use strict';
var mongoose = require('mongoose');
var Student = mongoose.model('Student');
var TaskRecord = mongoose.model('TaskRecord');
var ScoreTask = mongoose.model('ScoreTask');
var ScoreLog = mongoose.model('ScoreLog');

var taskApi = {
    /**
     * 列出当前用户任务列表
     */
    list: function *() {
        var user = this.state.jwtUser;
        var userId = user._id;
        var schoolId = user.schoolId;
        var records = yield TaskRecord.distinct('task', {student: userId}).exec();
        this.body = yield ScoreTask
            .where('schoolId', schoolId)
            .where('state', 0)
            .where('_id').nin(records).sort('-createdTime')
            .exec();
    },
    /**
     * 做任务
     */
    done: function *() {
        let user = this.state.jwtUser;
        let taskId = this.params.taskId;
        let userId = user._id;
        let taskRecord = yield TaskRecord.count({
            student: userId,
            task: taskId
        }).exec();
        if (taskRecord > 0) {
            this.throw(400, '已经做过任务啦');
        }
        let task = yield ScoreTask.findById(taskId, 'state scoreAward').lean().exec();
        if (!task || task.state !== 0) {
            this.throw(400, '任务不存在或者已经关闭');
        }
        //添加任务记录
        yield new TaskRecord({
            student: userId,
            task: taskId,
            schoolId: user.schoolId
        }).save();
        //执行加积分操作
        yield Student.update({
            _id: userId
        }, {$inc: {score: task.scoreAward}}).exec();

        let scoreLog = new ScoreLog({
            student: userId,
            value: task.scoreAward,
            operation: 0,
            remark: '任务奖励',
            schoolId: user.schoolId
        });
        //记录积分日志
        yield scoreLog.save();
        //更新任务参与人数
        yield ScoreTask.update({_id: taskId}, {$inc: {participants: 1}}).exec();
        this.body = true;
    }
};

module.exports = taskApi;
