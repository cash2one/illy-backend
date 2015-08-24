'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
/**
 *  积分兑换规则
 * @type {*|Schema}
 */
var scoreExchangeInstructionSchema = new Schema({
    title: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        trim: true
    },
    createdTime: {
        type: Date,
        default: Date.now
    },
    schoolId: {
        type: ObjectId,
        required: true
    }

});

module.exports = {
    ScoreExchangeInstruction: mongoose.model('ScoreExchangeInstruction', scoreExchangeInstructionSchema)
};
