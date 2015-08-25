/**
 * Created by Frank on 15/7/18.
 */
'use strict';

var cache = require('../../../common/cache');
var models = require('../../../models');
var co = require('co');

/**
 * 微信取消关注任务处理
 * @param data
 * @param done
 */
var unSubscribe = co.wrap(function*(data, done) {
    var openid = data.openid;
    var Student = models.Student;
    var Visitor = models.Visitor;
    // 解除用户绑定
    yield Student.update({openids: openid}, {$pull: {openids: openid}}).exec();
    yield Visitor.remove({openid: openid}).exec();
    yield cache.delete('token:user:' + openid);
    yield cache.delete('token:visitor:' + openid);
    done();
});


module.exports = function (queue) {

    queue.process('unSubscribe', function (job, done) {
        console.log('处理取关任务');
        unSubscribe(job.data, done);
    });

};
