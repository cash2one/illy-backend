'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;


/**
 * 商品兑换规则
 * @type {*|Schema}
 */
var scoreExchangeSchema = new Schema({
    // 商品名称
    productName: {
        type: String,
        required: true
    },
    // 商品图片
    imageKey: {
        type: String,
        required: true

    },
    // 兑换积分
    score: {
        type: Number,
        required: true

    },
    // 库存
    stock: {
        type: Number,
        required: true

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
        required: true,
        index: true
    }

});

module.exports = {
    ScoreExchange: mongoose.model('ScoreExchange', scoreExchangeSchema)
};
