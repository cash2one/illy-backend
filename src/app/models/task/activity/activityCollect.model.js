/**
 * Created by Frank on 15/7/20.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var activityCollectSchema = new Schema({

    activity: {
        type: ObjectId,
        ref: 'Activity',
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

    others: [{
        key: String,
        value: String,
        _id: false
    }],

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
    ActivityCollect: mongoose.model('ActivityCollect', activityCollectSchema)
};
