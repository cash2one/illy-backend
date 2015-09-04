/**
 * Created by Frank on 15/7/20.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var lotteryCollectSchema = new Schema({

    lottery: {
        type: ObjectId,
        ref: 'Lottery',
        index: true
    },

    name: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    award: {
        type: String
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
    LotteryCollect: mongoose.model('LotteryCollect', lotteryCollectSchema)
};
