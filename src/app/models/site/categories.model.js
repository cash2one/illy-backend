/**
 *
 * Created by Frank on 15/7/1.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var categorySchema = new Schema({
    // 分类名称
    name: {
        type: String
    },
    // 是否禁用
    disabled: {
        type: Number,
        enums: [0, 1], // 0 不禁用 1 禁用
        default: 0
    },

    // 序号
    order: {
        type: Number,
        default: 0    //数字越大越考前
    },

    created: {
        type: Date,
        default: Date.now
    },

    //文章数量
    postCount: {
        type: Number,
        default: 0
    },

    updated: {
        type: Date,
        default: Date.now
    },

    schoolId: {
        type: ObjectId,
        index: true
    }
});

categorySchema.pre('update', function (next) {
    this.update({updated: Date.now()});
    next();
});

module.exports = {
    Category: mongoose.model('Category', categorySchema)
};
