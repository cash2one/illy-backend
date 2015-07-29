'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


/**
 * 商品兑换规则
 * @type {*|Schema}
 */
var scoreExchangeSchema = new Schema({
    // 商品名称
    productName: {
        type: String,
        required: '商品名称不能为空'
    },
    // 商品图片
    imageKey: {
        type: String,
        required: '图片不能为空'

    },
    // 花费积分
    score: {
        type: Number,
        required: '积分不能为空'

    },
    // 库存
    stock: {
        type: Number,
        required: '库存不能为空'

    },
    // 兑换次数
    exchangeTimes: {
        type: Number,
        default: 0
    },

    createdTime: {
        type: Date,
        default: Date.now
    },

    schoolId: {
        type: ObjectId,
        required: '学校ID不能为空',
        index: true
    }

});

module.exports = {
    ScoreExchange: mongoose.model('ScoreExchange', scoreExchangeSchema)
};
