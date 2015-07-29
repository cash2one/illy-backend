/**
 * Created by Frank on 15/6/26.
 */

'use strict';
var Preview = require('../../models').Preview;

var previewApi = {

    /**
     * 获取未做的预习列表
     */
    todoList: function*() {
        var jwtUser = this.state.jwtUser;
        var userId = jwtUser._id;
        var schoolId = jwtUser.schoolId;
        var offset = this.request.query.offset || 0;
        var limit = this.request.query.limit || 10;
        var previews = yield Preview.find({
            schoolId: schoolId,
            state: 0,
            performances: {
                $elemMatch: {
                    student: userId,
                    state: 0
                }
            }
        }).select('title startTime endTime')
            .skip(offset)
            .limit(limit)
            .lean()
            .exec();
        this.body = previews || [];

    },

    /**
     * 获取指定预习
     */
    read: function*() {
        var preview = yield Preview.findById(this.params.id)
            .select('title exercises keyPoint keyPointRecord').lean().exec();
        if (!preview || preview.state === 1) {
            this.throw(400, '预习不存在或者已经结束');
        }
        this.body = preview;
    },

    /**
     * 提交预习
     */
    addPerformance: function*() {

    }
};


module.exports = previewApi;
