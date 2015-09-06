/**
 * Created by Frank on 15/6/26.
 */
'use strict';
var homework = require('../../api/v1/homework.api');
module.exports = function (api) {

    /**
     * @api {get} /api/v1/homework 作业列表
     * @apiName GetTodoHomeworkList
     * @apiGroup Homework
     * @apiVersion 0.0.1
     * @apiHeader {String} Authorization Json web token
     * @apiPermission 认证用户
     * @apiParam {Number} limit=10 返回数据数量 (用于分页)
     * @apiParam {Number} offset=0 数据查询偏移数量 (用于分页)
     * @apiSuccess {Object[]} response 返回的response数据
     * @apiSuccess {String} response._id 作业ID
     * @apiSuccess {String} response.title 作业标题
     * @apiSuccess {Date} response.createdTime 创建时间
     * @apiSuccess {Number} response.finishedCount  完成人数
     *
     * @apiSuccessExample 成功响应示例
     *     HTTP/1.1 200 OK
     *     [{
   *       "_id" : "xxx",
   *       "title": "新概念作业第一章",
   *       "createdTime":"标准GMT时间",
   *       "finishedCount": 10
   *     },
     *     {
   *       "_id" : "xxx",
   *       "title": "新概念作业第二章",
   *       "createdTime":"标准GMT时间",
   *       "finishedCount" : 0
   *     }]
     *
     */
    api.get('/homework', homework.todoList);

    /**
     *
     * @api {get} /api/v1/homework/:id 作业详情
     * @apiName ViewTodoHomework
     * @apiGroup Homework
     * @apiVersion 0.0.1
     * @apiHeader {String} Authorization Json web token
     * @apiPermission 认证用户
     * @apiSuccess {String} _id 作业ID
     * @apiSuccess {String} title 作业标题
     * @apiSuccess {String} keyPoint 知识重点
     * @apiSuccess {String} keyPointRecord 知识重点录音URL
     * @apiSuccess {Object[]} quiz.exercises 题目列表
     * @apiSuccess {Number} quiz.exercises.sequence 题目序号
     * @apiSuccess {Number} quiz.exercises.eType 题目类型 (0:文字选择  1:图片选择 2:填空题 3:录音题)
     * @apiSuccess {String} quiz.exercises.question 题干
     * @apiSuccess {String} quiz.exercises.description 题目说明
     * @apiSuccess {Object[]} quiz.exercises.choices 选项列表 (只有选择题有该字段)
     * @apiSuccess {String} quiz.exercises.choices.title 选项标题 (例如 A B C D )
     * @apiSuccess {String} quiz.exercises.choices.content 选项内容
     * @apiSuccess {String} quiz.exercises.answer 答案
     * @apiSuccess {String} quiz.exercises.analysis 答案解析(可选)
     *
     *
     *
     */
    api.get('/homework/:id([a-f0-9]{24})', homework.read);


    /**
     *
     * @api {put} /api/v1/homework/:id/performance 提交作业
     * @apiName AddHomeworkPerformance
     * @apiGroup Homework
     * @apiVersion 0.0.1
     * @apiHeader {String} Authorization Json web token
     * @apiPermission 认证用户
     *
     * @apiParam{String} _id 作业ID
     * @apiParam{Object[]} wrongCollect 错题列表
     * @apiParam{Number} wrongCollect.exerciseId 题目序号
     * @apiParam{String} wrongCollect.answer  错误答案
     * @apiParam{Number} spendSeconds 花费秒数
     * @apiParam{Object[]} audioAnswers 录音答案
     * @apiParam{Number} audioAnswers.sequence 题目序号
     * @apiParam{String} audioAnswers.answer  录音url
     *
     * @apiSuccess {Number} totalAward 本次奖励积分数量
     * @apiSuccess {Number} rightCount 正确题目数量
     * @apiSuccess {Number} wrongCount 错误题目数量
     * @apiSuccess {Number} totalScore 学生当前积分总数
     *
     */
    api.put('/homework/:id([a-f0-9]{24})/performance', homework.addPerformance);

    /**
     *
     * @api {get} /api/v1/homework/mistake 错题集
     * @apiName GetMistakeHomeworkList
     * @apiGroup Homework
     * @apiVersion 0.0.1
     * @apiHeader {String} Authorization Json web token
     * @apiPermission 认证用户
     *
     * @apiParam {Number} limit=10 返回数据数量 (用于分页)
     * @apiParam {Number} offset=0 数据查询偏移数量 (用于分页)
     *
     * @apiSuccess {Object[]} response 返回的response数据
     * @apiSuccess {String} response._id 作业ID
     * @apiSuccess {String} response.title 作业标题
     * @apiSuccess {Number} response.wrongNumber 错题数量
     * @apiSuccess {Date} response.finishedTime 完成时间
     *
     */

    api.get('/homework/mistake', homework.mistakeList);


    /**
     *
     * @api {get} /api/v1/homework/mistake/:homeworkId 错题详情
     * @apiName GetMistakeHomeworkDetail
     * @apiGroup Homework
     * @apiVersion 0.0.1
     * @apiHeader {String} Authorization Json web token
     * @apiPermission 认证用户
     *
     * @apiSuccess {Object[]} exercises 题目列表
     * @apiSuccess {Number} exercises.sequence 题目序号
     * @apiSuccess {Number} exercises.eType 题目类型 (0:文字选择  1:图片选择 2:填空题)
     * @apiSuccess {String} exercises.question 题干
     * @apiSuccess {String} exercises.description 题目说明
     * @apiSuccess {Object[]} exercises.choices 选项列表 (只有选择题有该字段)
     * @apiSuccess {String} exercises.choices.title 选项标题 (例如 A B C D )
     * @apiSuccess {String} exercises.choices.content 选项内容
     * @apiSuccess {String} exercises.answer 答案
     * @apiSuccess {String} exercises.wrongAnswer 错误答案
     * @apiSuccess {String} exercises.analysis 答案解析(可选)
     *
     */
    api.get('/homework/mistake/:homeworkId', homework.mistakeDetail);


    /**
     *
     * @api {get} /api/v1/homework/comments 评语列表
     * @apiName GetComments
     * @apiGroup Homework
     * @apiVersion 0.0.1
     * @apiHeader {String} Authorization Json web token
     * @apiPermission 认证用户
     *
     * @apiParam {Number} limit=5 返回数据数量 (用于分页)
     * @apiParam {Number} offset=0 数据查询偏移数量 (用于分页)
     * @apiSuccess {Object[]} response 返回的response数据
     * @apiSuccess {String} response._id 作业ID
     * @apiSuccess {Date} response.title 作业标题
     * @apiSuccess {Number} response.comment 评语内容
     *
     * @apiSuccessExample 成功响应示例
     *     HTTP/1.1 200 OK
     *     [{
   *       "_id" : "xxx",
   *       "title": "新概念作业第一章",
   *       "comment":"做的不错"
   *     },
     *     {
   *       "_id" : "xxx",
   *       "title": "新概念作业第二章",
   *       "comment":"错题太多"
   *     }]
     *
     */
    api.get('/homework/comments', homework.commonList);

};
