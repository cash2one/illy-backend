/**
 *
 * Created by Frank on 15/7/3.
 */
'use strict';

var parser = require('./xmlParser');
var eventHandler = require('./event');
var msgHandler = require('./msg');
/**
 * 处理微信信息接口
 * @returns {Function}
 */
module.exports = function () {
    var weixinMatch = new RegExp('^/msg');
    return function*(next) {
        if (!weixinMatch.test(this.url)) {
            yield next;
            return;
        }
        yield parser(this);
        var msg = this.request.xml;
        if (!msg) {
            return this.body = '';
        }
        // 处理事件类型消息
        if (msg.MsgType === 'event') {
            return this.body = yield eventHandler(msg);
        }
        // 处理普通类型消息
        this.body = yield msgHandler(msg);
    }
};
