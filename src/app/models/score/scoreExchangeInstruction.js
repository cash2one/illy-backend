'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;
/**
 *  积分兑换规则
 * @type {*|Schema}
 */
var scoreExchangeInstructionSchema = new Schema({

    content: {
        type: String,
        default: '',
        trim: true
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
    ScoreExchangeInstruction: mongoose.model('ScoreExchangeInstruction', scoreExchangeInstructionSchema)
};
