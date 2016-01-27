/**
 * Created by Frank on 16/1/11.
 */

'use strict';
const mongoose = require('mongoose');
const Event = mongoose.model('Event');

const activitySchema = new mongoose.Schema({

    // 开始时间
    startTime: {
        type: Date,
        required: true
    },

    // 结束时间
    endTime: {
        type: Date,
        required: true
    },

    // 活动地址
    address: {
        type: String
    }
});

module.exports = activitySchema;
