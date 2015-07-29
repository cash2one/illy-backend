/**
 * Created by Frank on 15/7/18.
 */


var cache = require('../../common/cache'),
    co = require('co'),
    mongoose = require('mongoose');

/**
 * 微信取消关注任务处理
 * @param data
 * @param done
 */
var unSubscribe = co.wrap(function*(data, done) {
    var openid = data.openid;
    var Student = mongoose.model('Student');
    // 解除用户绑定
    yield Student.update({openids: openid}, {$pull: {openids: openid}}).exec();
    yield cache.delete('openid:' + openid);
    done();
});


module.exports = function (queue) {

    queue.process('unSubscribe', function (job, done) {
        console.log('处理取关任务');
        unSubscribe(job.data, done);
    });

};
