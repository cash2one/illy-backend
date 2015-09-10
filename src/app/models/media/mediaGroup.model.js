/**
 * Created by Frank on 15/7/2.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var groupSchema = new Schema({
    //媒体库名称
    name: {
        type: String,
        required: true
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
    MediaGroup: mongoose.model('MediaGroup', groupSchema)
};
