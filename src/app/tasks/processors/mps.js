/**
 * Created by Frank on 15/10/12.
 */
'use strict';

var co = require('co');
var qn = require('../../qiniu');


//thunk 包装函数，便于co调用
var toThunk = function (key, fops, options) {
    return callback => {
        qn.pfop(key, fops, options, callback);
    };
};

var convertToMp3 = co.wrap(function*(data, done) {
    try {
        let options = {};
        if (data.notifyURL) {
            options.notifyURL = data.notifyURL;
        }
        yield toThunk(data.key, 'avthumb/mp3|saves' + pfoKey, options);
        done();
    } catch (err) {
        done(err);
    }
});

module.exports = function (queue) {
    queue.process('convertToMp3', function (job, done) {
        convertToMp3(job.data, done).catch(function (err) {
            console.error('Convert to mp3 error ,', err);
            done(err);
        });
    });
};
