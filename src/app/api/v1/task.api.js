/**
 * Created by Frank on 15/7/27.
 */

'use strict';
var models = require('../../models');
var Task = models.Task;
var TaskRecord = models.TaskRecord;
var Post = models.Post;
var Activity = models.Activity;
var ActivityCollect = models.ActivityCollect;
var Student = models.Student;


var taskApi = {

    /**
     * 列出当前用户任务列表
     */
    list: function *() {
        var user = this.state.jwtUser;
        var userId = user._id;
        var schoolId = user.schoolId;
        var records = yield TaskRecord.distinct('task', {student: userId}).exec();
        this.body = yield Task
            .where('schoolId', schoolId)
            .where('state', 0)
            .where('_id').nin(records).sort('-createdTime')
            .exec();
    },

    /**
     * 读取当前任务
     */
    read: function *() {
        var taskId = this.params.taskId;
        var task = yield Task.findById(taskId, 'taskType state item')
            .lean()
            .exec();
        if (!task || task.state !== 0) {
            this.throw(400, '任务已结束');
        }
        var itemId = task.item;
        var ItemModel;
        switch (task.taskType) {
            case(0):
                ItemModel = Post;
                break;
            case(1):
                ItemModel = Activity;
                break;
        }
        var item = yield ItemModel.findByIdAndUpdate(itemId, {$inc: {visitCount: 1}}).lean().exec();
        if (!item) {
            this.throw(400, '任务内容不存在');
        }
        item.taskType = task.taskType;
        this.body = item;
    },

    /**
     * 做任务
     */
    done: function *() {
        var user = this.state.jwtUser;
        var userId = user._id;
        var taskId = this.params.taskId;
        var task = yield Task.findById(taskId, 'taskType state item scoreAward')
            .lean()
            .exec();

        if (!task) {
            this.throw(400, '任务不存在');
        }
        if (task.state === 1) {
            this.throw(400, '任务已经关闭');
        }
        var taskRecord = new TaskRecord({
            student: userId,
            task: taskId,
            schoolId: user.schoolId
        });
        yield taskRecord.save();
        var student = yield Student.findByIdAndUpdate(userId, {$inc: {score: task.scoreAward}}, {new: true}).exec();
        yield Task.update({_id: taskId}, {$inc: {shareCount: 1, participants: 1}}).exec();
        this.body = {score: student.score};
    }
};

module.exports = taskApi;
