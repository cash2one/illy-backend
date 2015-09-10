/**
 *
 * Created by Frank on 15/6/5.
 */

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var scheduleSchema = new Schema({

    title: {
        type: String,
        trim: true,
        required: true
    },

    start: {
        type: Date,
        required: true
    },

    end: {
        type: Date,
        required: true
    },

    creator: {
        type: ObjectId,
        required: true
    },

    personal: {        //是否私人日程
        type: Boolean,
        default: true
    },

    participants: {   //参与者 ，非私人日程时使用
        type: [ObjectId],
        index: 1
    },

    remark: {
        type: String,
        trim: true
    },

    schoolId: {
        type: ObjectId,
        required: true
    }
});

scheduleSchema.index({creator: 1, startTime: 1, endTime: 1});
module.exports = {
    Schedule: mongoose.model('Schedule', scheduleSchema)
};
