/**
 * Created by Frank on 15/7/1.
 *
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var postSchema = new Schema({

    // 标题
    title: {
        type: String
    },
    image: {
        type: String
    },
    // 内容
    content: {
        type: String
    },

    // 对应分类
    category: {
        type: ObjectId,
        ref: 'Category'
    },

    // 访问量
    visitCount: {
        type: Number,
        default: 0
    },

    // 分享数量
    shareCount: {
        type: Number,
        default: 0
    },

    like: {
        type: Number,
        default: 0
    },

    //是否轮播
    isSlide: {
        type: Number,
        enums: [0, 1], //0 否  1 是
        default: 0
    },
    // 标签
    tags: {
        type: [String]
    },

    createdTime: {
        type: Date,
        default: Date.now
    },

    schoolId: {
        type: ObjectId,
        index: true
    }

});

module.exports = {
    Post: mongoose.model('Post', postSchema)
};
