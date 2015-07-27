/**
 * Created by Frank on 15/7/2.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var groupSchema = new Schema({
    //媒体库名称
    name: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    schoolId: {
        type: ObjectId,
        index: true
    }
});

groupSchema.pre('save', function (next) {
    if (!this.name || this.name.trim() === '') {
        next(new Error('分组名称不能为空'));
    }
    if (!this.schoolId) {
        next(new Error('学校ID不能为空'));
    }
    next();
});


module.exports = {
    MediaGroup: mongoose.model('MediaGroup', groupSchema)
};
