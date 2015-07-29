/**
 * Created by Frank on 15/6/26.
 */
'use strict';
var preview = require('../../api/v1/preview.api');
module.exports = function (api) {

    /**
     * @api {get} /api/v1/previews 预习列表
     * @apiName GetTodoPreviews
     * @apiGroup Preview
     * @apiVersion 0.0.1
     * @apiHeader {String} Authorization Json web token
     * @apiPermission 认证用户
     *
     * @apiSuccess {Object[]} response 返回的response数据
     * @apiSuccess {String} response._id 预习ID
     * @apiSuccess {Date} response.title 开始时间
     * @apiSuccess {Date} response.startTime 结束时间
     *
     */
    api.get('/previews', preview.todoList);

    /**
     * @api {get} /api/v1/previews/:id 预习详情
     * @apiName ViewTodoPreview
     * @apiGroup Preview
     * @apiVersion 0.0.1
     * @apiHeader {String} Authorization Json web token
     * @apiPermission 认证用户
     *
     *
     */
    api.get('/previews/:id([a-f0-9]{24})', preview.read);

    /**
     *
     * @api {put} /api/v1/homework/:id/performance 提交预习
     * @apiName AddPreviewPerformance
     * @apiGroup Preview
     * @apiVersion 0.0.1
     * @apiHeader {String} Authorization Json web token
     * @apiPermission 认证用户
     *
     * @apiParam{String} _id 预习ID
     * @apiParam{Object[]} wrongCollect 错题列表
     * @apiParam{Number} wrongCollect.exerciseId 题目序号
     * @apiParam{String} wrongCollect.answer  错误答案
     *
     * @apiParam{Object[]} audioAnswers 录音题答案
     * @apiParam{Number} audioAnswers.exerciseId 题目序号
     * @apiParam{String} audioAnswers.answer  录音url
     *
     *
     */
    api.put('/previews/:id([a-f0-9]{24})/performance', preview.addPerformance);
};
