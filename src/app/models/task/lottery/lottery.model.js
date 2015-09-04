/**
 *
 * Created by Frank on 15/7/20.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var awardSchema = new Schema({

    sequence: {
        type: Number,
        required: true
    },

    awardName: {
        type: String,
        required: true
    },

    awardImage: {
        type: String
    },

    limit: {
        type: Number,
        default: 0
    }

}, {_id: false});

var lotterySchema = new Schema({

    deadline: {       // 截至日期
        type: Date,
        require: true
    },

    shareCount: {     // 分享数量
        type: Number,
        default: 0
    },

    visitCount: {    //  访问数量
        type: Number,
        default: 0
    },

    like: {     //赞
        type: Number,
        default: 0
    },

    awards: [awardSchema],

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
    Lottery: mongoose.model('Lottery', lotterySchema)
};
