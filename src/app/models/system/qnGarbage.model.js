/**
 * Created by Frank on 15/7/24.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 *
 * 需要删除的七牛资源key
 *
 */

var garbageSchema = new Schema({
    key: String,
    created: {
        type: Date,
        default: Date.now
    }
});


module.exports = {
    QnGarbage: mongoose.model('QnGarbage', garbageSchema)
};
