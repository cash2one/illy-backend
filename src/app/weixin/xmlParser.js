/**
 *
 * Created by Frank on 15/7/5.
 */
'use strict';

//用于解析微信xml格式信息
var bodyParser = require('co-body');
var xml2js = require('xml2js');
module.exports = function () {

    function* xmlParser(ctx) {
        var body = yield  bodyParser.text(ctx);
        var parser = new xml2js.Parser({trim: true, explicitRoot: false, explicitArray: false});
        var xmlResponse = yield new Promise(function (resolve, reject) {
            parser.parseString(body, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        ctx.request.xml = xmlResponse || {};
    }

    return function *(next) {
        var contentType = this.request.headers['content-type'];
        if (contentType === 'text/xml') {
            try {
                console.log(this.request.url);
                yield* xmlParser(this);
            }
            catch (err) {
                console.error('Parse xml message error ', err);
            }
        }
        yield next;
    }
};


