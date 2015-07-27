/**
 * Created by Frank on 15/7/27.
 */
var task = require('../../api/v1/task.api');
module.exports = function (api) {

  /**
   * @api {get} /api/v1/tasks 列出所有任务
   * @apiName ListTasks
   * @apiGroup Task
   * @apiVersion 0.0.1
   * @apiPermission 认证用户
   * @apiHeader {String} Authorization Json web token
   * @apiParam {Number} offset=0  偏移
   * @apiParam {Number} limit=5 数量
   * @apiSuccess {Object[]} response
   * @apiSuccess {String} response.name 任务名称
   * @apiSuccess {String} response.taskType 任务类型(0: 文章分享 1:活动分享)
   * @apiSuccess {String} response.scoreAward 奖励积分数
   * @apiSuccess {String} response.shareCount 分享数量
   * @apiSuccess {String} response.visitCount 阅读数量
   *
   *
   */
  api.get('/api/v1/tasks', task.list);

  /**
   * @api {get} /api/v1/tasks/:taskId  获取任务详情
   * @apiName ReadTask
   * @apiGroup Task
   * @apiVersion 0.0.1
   * @apiPermission 认证用户
   * @apiHeader {String} Authorization Json web token
   *
   *
   */
  api.get('/api/v1/tasks/:taskId', task.read);

  /**
   * @api {put} /api/v1/tasks/:taskId/share 分享通知接口
   * @apiName ShareTask
   * @apiGroup Task
   * @apiVersion 0.0.1
   * @apiPermission 认证用户
   * @apiHeader {String} Authorization Json web token
   *
   *
   */
  api.put('/api/v1/tasks/:taskId/share', task.share);


  /**
   * @api {post} /api/v1/activities/:activityId/info 添加活动报名信息
   * @apiName AddActivityInfo
   * @apiGroup Task
   * @apiVersion 0.0.1
   * @apiPermission 认证用户
   * @apiHeader {String} Authorization Json web token
   *
   *
   */
  api.post('/api/v1/activities/:activityId/info', task.activityInfo);


};
