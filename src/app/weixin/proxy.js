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
    return function*(next) {
        var regx = new RegExp('^/msg');
        var url = this.url;
        if (!regx.test(url)) {
            yield next;
        } else {
            var msg = this.request.xml;
            if (!msg) {
                console.error('Receive unresolved message from : ', url);
                return this.body = '';
            }
            var ret;
            // 处理事件类型消息
            if (msg.MsgType === 'event') {
                ret = yield eventHandler(msg);
            }
            // 处理普通类型消息
            else {
                ret = yield msgHandler(msg);
            }
            this.body = ret;
        }
    };
};
