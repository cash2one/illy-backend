/**
 * Created by Frank on 15/10/12.
 */
'use strict';

var co = require('co');
var qn = require('../../qiniu');


var convertToMp3 = co.wrap(function*(data, done) {
    let options = data.options || {};
    let pfoKey = qn.util.urlsafeBase64Encode(qn.config.bucket + ':' + data.key + '.mp3');
    yield qn.pfop(data.key, 'avthumb/mp3|saveas/' + pfoKey, options);
    done();
});

module.exports = function (queue) {
    queue.process('convertToMp3', function (job, done) {
        convertToMp3(job.data, done).catch(function (err) {
            console.error('Convert to mp3 error ,', err);
            done(err);
        });
    });
};
