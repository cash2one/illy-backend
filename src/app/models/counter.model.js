'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;


var counterSchema = new Schema({

    cType: {
        type: String,
        required: true
    },

    schoolId: {
        type: ObjectId
    },

    seq: {
        type: Number,
        default: 0
    }
});

counterSchema.index({schoolId: 1, cType: 1});

counterSchema.statics.generateSequence = function (type, schoolId, callback) {
    var query = {cType: type},
        update = {$inc: {seq: 1}},
        options = {upsert: true};
    if (schoolId) {
        query.schoolId = schoolId;
    }

    this.findOneAndUpdate(query, update, options, callback);
};

module.exports = {Counter: mongoose.model('Counter', counterSchema)};
