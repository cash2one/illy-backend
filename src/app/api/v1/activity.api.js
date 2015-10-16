/**
 *
 * Created by Frank on 15/8/13.
 */

'use strict';
var models = require('../../models');
var Activity = models.Activity;
var ActivityCollect = models.ActivityCollect;

var api = {

    /**
     * 读取活动信息
     */
    readActivity: function *() {
        this.body = yield Activity.findByIdAndUpdate(this.params.activityId, {$inc: {visitCount: 1}}, {'new': true}).exec();
    },

    /**
     * 添加活动信息
     */
    activityInfo: function *() {
        var activity = yield Activity.findById(this.params.activityId, 'schoolId').exec();
        if (!activity) {
            this.throw(400, '活动不存在');
        }
        var info = new ActivityCollect({
            activity: activity,
            others: this.request.body.others,
            name: this.request.body.name,
            phone: this.request.body.phone,
            schoolId: activity.schoolId
        });
        this.body = yield info.save();
    },


    /**
     * 分享接口，用于更新
     */
    share: function *() {
        var activityId = this.params.activityId;
        this.body = yield Activity.update({_id: activityId}, {$inc: {shareCount: 1}}).exec();
    },


    /**
     * 点赞
     */
    like: function *() {
        var activityId = this.params.activityId;
        this.body = yield Activity.update({_id: activityId}, {$inc: {like: 1}}).exec();
    }

};


module.exports = exports = api;
