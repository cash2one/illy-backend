/**
 * Created by Frank on 15/7/9.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


var visitorSchema = new Schema({
    openid: {
        type: String,
        index: true,
        required: true
    },
    schoolId: {
        type: ObjectId,
        required: true,
        index: true
    },

    createdTime: {
        type: Date,
        default: Date.now
    }
});

module.exports = {
    Visitor: mongoose.model('Visitor', visitorSchema)
};
