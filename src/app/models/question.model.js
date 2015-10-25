/**
 *
 * Created by Frank on 15/10/10.
 */

'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var questionSchema = new Schema({

    student: {
        type: ObjectId,
        ref: 'Student',
        required: true
    },

    questionImage: {
        type: String
    },

    questionText: {
        type: String
    },

    state: {
        type: Number,
        default: 0  // 0: 未回答  1: 已回答
    },
    answer: {
        type: String
    },

    teacher: {
        type: ObjectId,
        ref: 'Teacher'
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
    Question: mongoose.model('Question', questionSchema)
};


