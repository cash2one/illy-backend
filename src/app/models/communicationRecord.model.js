'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var communicationRecordSchema = new Schema({
    content: {
        type: String,
        required: true
    },

    student: {
        type: ObjectId,
        required: true,
        index: 1,
        ref: 'Student'
    },

    creator: {
        type: ObjectId,
        required: true,
        ref: 'Teacher'
    },

    // 创建时间
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
    CommunicationRecord: mongoose.model('CommunicationRecord', communicationRecordSchema)
};
