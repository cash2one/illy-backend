/**
 *
 * Created by Frank on 15/7/20.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var activitySchema = new Schema({

    theme: {          // 活动主题
        type: String,
        require: true
    },

    startTime: {      // 开始时间
        type: Date,
        require: true
    },

    endTime: {        // 结束时间
        type: Date,
        require: true
    },

    deadline: {       // 截至日期
        type: Date,
        require: true
    },

    address: {        // 活动地点
        type: String,
        require: true
    },

    content: {        // 活动详情
        type: String,
        require: true
    },

    limit: {          // 限制人数
        type: Number
    },

    infoCollect: {    // 信息收集
        type: [String]
    },

    shareCount: {     // 分享数量
        type: Number,
        default: 0
    },

    visitCount: {    //  访问数量
        type: Number,
        default: 0
    },
    like: {
        type: Number,
        default: 0
    },
    createdTime: {
        type: Date,
        default: Date.now
    },
    schoolId: {
        type: ObjectId,
        require: true
    }

});

module.exports = {
    Activity: mongoose.model('Activity', activitySchema)
};
