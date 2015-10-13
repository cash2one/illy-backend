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
        ref: 'Student'
    },

    questionImage: {
        type: String
    },

    questionText: {
        type: String
    },

    state: {
        type: Number,
        default: 0
    },

    reply: {
        type: String
    },

    replyer: {
        type: ObjectId,
        ref: 'Teacher'
    },

    schoolId: {
        type: ObjectId
    }

});

module.exports = {
    Question: mongoose.model('Question', questionSchema)
};


