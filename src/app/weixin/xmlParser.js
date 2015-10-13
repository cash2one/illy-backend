/**
 *
 * Created by Frank on 15/7/5.
 */
'use strict';

//用于解析微信xml格式信息
var bodyParser = require('co-body');
var xml2js = require('xml2js');
var co = require('co');
module.exports = co.wrap(function* xmlParser(ctx) {
    var contentType = ctx.request.headers['content-type'];
    if (contentType !== 'text/xml') {
        return;
    }
    var body = yield  bodyParser.text(ctx);
    var parser = new xml2js.Parser({trim: true, explicitRoot: false, explicitArray: false});
    ctx.request.xml = yield new Promise(function (resolve, reject) {
        parser.parseString(body, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
});



