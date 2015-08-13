/**
 * Created by Frank on 15/8/13.
 */


'use strict';
var activity = require('../../api/v1/activity.api');

module.exports = function (api) {

    /**
     *
     * @api {get} /api/v1/public/activities/:activityId 活动详情
     * @apiName ReadActivity
     * @apiGroup Activity
     * @apiVersion 0.0.1
     * @apiPermission public
     * @apiHeader {String} Authorization Json web token
     * @apiSuccess {String} theme      活动主题
     * @apiSuccess {String} content    活动内容
     * @apiSuccess {Date} startTime    活动开始时间
     * @apiSuccess {Date} endTime      活动结束时间
     * @apiSuccess {Date} deadline     报名截止日期
     * @apiSuccess {Number} shareCount 分享数量
     * @apiSuccess {Number} visitCount 访问量
     * @apiSuccess {Number} like 赞
     *
     *
     */
    api.get('/public/activities/:activityId([a-f0-9]{24})', activity.readActivity);


    /**
     * @api {put} /api/v1/public/activities/:activityId/share  更新分享数
     * @apiName UpdateShareCount
     * @apiGroup Activity
     * @apiVersion 0.0.1
     * @apiPermission public
     * @apiHeader {String} Authorization Json web token
     *
     */
    api.put('/public/activities/:activityId([a-f0-9]{24})/share', activity.share);


    /**
     * @api {put} /api/v1/public/activities/:activityId/like 点赞
     * @apiName UpdateActivityLike
     * @apiGroup Activity
     * @apiVersion 0.0.1
     * @apiPermission public
     * @apiHeader {String} Authorization Json web token
     *
     */
    api.put('/public/activities/:activityId([a-f0-9]{24})/like', activity.like);


    /**
     * @api {post} /api/v1/public/activities/:activityId/info 添加活动报名信息
     * @apiName AddActivityInfo
     * @apiGroup Activity
     * @apiVersion 0.0.1
     * @apiPermission public
     * @apiHeader {String} Authorization Json web token
     *
     *
     */
    api.post('/public/activities/:activityId([a-f0-9]{24})/info', activity.activityInfo);
};
