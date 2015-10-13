/**
 * Created by Frank on 15/10/12.
 */
'use strict';
var qn = require('qiniu');
var co = require('co');
var config = {
    accessKey: 'SPJ9b_qmVxy0FQU-93J4xb5EbHv9Z4Jn_-78f8gr',
    secretKey: 'NOFnKRTsd1RjjYoyT1qPAgHyczBmAjl-s26GXpA4',
    bucket: 'yirgacheffe',
    visitUrl: 'resource.hizuoye.com'
};

qn.conf.ACCESS_KEY = config.accessKey;
qn.conf.SECRET_KEY = config.secretKey;
qn.conf.bucket = config.bucket;

console.log(qn.conf);


var fetchThunk = function (url, bucket, key) {
    let client = new qn.rs.Client();
    return callback => {
        client.fetch(url, bucket, key, function (err, res) {
            callback(err, res);
        });
    };
};


let fetch = co.wrap(function *() {
    let res = null;
    try {
        res = yield fetchThunk('http://image.beekka.com/blog/201210/bgd2012102601.jpg', config.bucket, 'test');
    } catch (err) {
        console.log('err: ', err);
    }
    console.log(res);
});

fetch().catch(function (err) {
    console.log(err);
});







