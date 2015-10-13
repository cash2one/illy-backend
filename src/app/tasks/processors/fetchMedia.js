/**
 * Created by Frank on 15/10/12.
 */

'use strict';
var co = require('co');
var qn = require('../../qiniu');
var request = require('request-promise');
var token = require('../../weixin/token');


//thunk 包装函数，便于co调用
var fetchThunk = function (url, key) {
    return callback => {
        qn.fetch(url, key, callback);
    };
};

var fetch = co.wrap(function *(data, done) {
    let mediaId = data.mediaId;
    let key = data.key;
    let accessToken = yield  token.getAccessToken();
    let url = `http://api.weixin.qq.com/cgi-bin/media/get?access_token=${accessToken}&media_id=${mediaId}`;
    try {
        let res = yield fetchThunk(url, key);
        if (res.mimeType === 'text/html') {
            //从微信端抓取失败,尝试刷新token后重试
            yield token.refreshToken();
            return done(new Error('Fetch error !!'));
        }
        done();
    } catch (err) {
        console.error('Fetch error ,', err);
        done(err);
    }
});

module.exports = function (queue) {
    queue.process('fetchMedia', function (job, done) {
        fetch(job.data, done).catch(function (err) {
            console.error('Fetch error ,', err);
            done(err);
        });
    });
};
