/**
 * Created by Frank on 15/7/27.
 */
var models = require('../../models');
var Task = models.Task;
var TaskRecord = models.TaskRecord;
var Post = models.Post;
var Activity = models.Activity;
var ActivityCollect = models.ActivityCollect;

/**
 *
 * 列出当前用户任务列表
 *
 */
exports.list = function *() {
  var user = this.state.jwtUser;
  var userId = user._id;
  var schoolId = user.schoolId;
  var records = yield TaskRecord.distinct('task', {student: userId}).exec();
  this.body = yield Task
    .where('schoolId', schoolId)
    .where('state', 0)
    .where('_id').nin(records).exec();

};

/**
 *
 * 读取当前任务
 *
 */
exports.read = function *() {
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
};

/**
 *
 * 处理分享事件
 *
 */
exports.share = function *() {
  var user = this.state.jwtUser;
  var userId = user._id;
  var taskId = this.params.taskId;
  var task = yield Task.findById(taskId, 'taskType state item')
    .lean()
    .exec();

  if (!task) {
    this.throw(400, '任务不存在');
  }
  var taskRecord = new TaskRecord({
    student: userId,
    task: taskId,
    schoolId: user.schoolId
  });
  yield taskRecord.save().exec();
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
  if (ItemModel) {
    yield Task.update({_id: taskId}, {$inc: {shareCount: 1, participants: 1}}).exec();
    yield ItemModel.update({_id: itemId}, {$inc: {shareCount: 1}}).exec();
  }
};


/**
 *
 * 添加活动信息
 *
 */
exports.activityInfo = function *() {
  var activity = Activity.findById(this.params.activityId, 'schoolId').exec();
  if (!activity) {
    this.throw(400, '活动不存在');
  }
  var info = new ActivityCollect({
    activity: activity,
    info: this.request.body.info,
    schoolId: activity.schoolId
  });
  yield info.save().exec();

};
