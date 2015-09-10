/**
 * Created by Frank on 15/7/2.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var mediaSchema = new Schema({
    // 媒体名称
    name: {
        type: String,
        trim: true,
        required: true
    },
    // 媒体类型
    mType: {
        type: Number,
        enums: [0, 1, 2],  // 0 图片  1 音频  2 视频
        default: 0
    },

    // 媒体分组
    group: {
        type: ObjectId,
        index: true
    },
    // 七牛资源 key
    key: {
        type: String,
        required: true
    },
    // 状态
    state: {
        type: Number,
        enums: [0, 1, 2],  // 0 正常使用  1 假删除  2 可永久删除
        default: 0
    },

    // 创建时间
    createdTime: {
        type: Date,
        default: Date.now
    },

    schoolId: {
        type: ObjectId,
        required: true
    }

});

mediaSchema.index({schoolId: 1, group: 1});
module.exports = {
    Media: mongoose.model('Media', mediaSchema)
};
