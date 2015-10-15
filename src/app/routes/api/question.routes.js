/**
 * Created by Frank on 15/10/13.
 */

'use strict';
var question = require('../../api/v1/question.api');
module.exports = function (api) {

    /**
     * @api {post} /api/v1/questions 创建问题
     * @apiName  CreateQuestion
     * @apiGroup Question
     * @apiVersion 0.0.1
     * @apiPermission 认证用户
     * @apiParam {String} questionImage 问题图片
     * @apiParam {String} questionText  问题内容
     * @apiSuccessExample 成功响应示例
     *     HTTP/1.1 200 OK
     *
     */
    api.post('/questions', question.create);


    /**
     * @api {get} /api/v1/questions 列出问题
     * @apiName  ListQuestions
     * @apiGroup Question
     * @apiVersion 0.0.1
     * @apiPermission 认证用户
     * @apiParam {Number} limit=10 返回数据数量 (用于分页)
     * @apiParam {Number} offset=0 数据查询偏移数量 (用于分页)
     * @apiParam {Number} state  问题状态  (0: 未回答   1:已回答)
     *
     * @apiSuccess {Object[]} response
     * @apiSuccess {String} response.questionImage 问题图片
     * @apiSuccess {String} response.questionText  问题说明
     * @apiSuccess {Date}   response.createdTime 创建日期
     *
     *
     */
    api.get('/questions', question.list);


    /**
     * @api {get} /api/v1/questions/:questionId 问题详情
     * @apiName  ReadQuestion
     * @apiGroup Question
     * @apiVersion 0.0.1
     * @apiPermission 认证用户
     * @apiSuccess {String} questionImage 问题图片
     * @apiSuccess {String} questionText  问题说明
     * @apiSuccess {Date}   createdTime 创建日期
     * @apiSuccess {String} answer 答案
     * @apiSuccess {Object} teacher 教师
     * @apiSuccess {String} teacher._id 教师ID
     * @apiSuccess {String} teacher.displayName 教师姓名
     *
     *
     */
    api.get('/questions/:questionId', question.read);


    /**
     * @api {delete} /api/v1/questions/:questionId 删除问题
     * @apiName  ReadQuestion
     * @apiGroup Question
     * @apiVersion 0.0.1
     * @apiPermission 认证用户
     *
     *
     */
    api.delete('/questions/:questionId', question.remove);

};