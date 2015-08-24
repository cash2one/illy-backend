/**
 * Created by Frank on 15/8/22.
 *
 * 处理menu点击事件
 *
 */

'use strict';
var co = require('co');
var _ = require('lodash');
var format = require('string-template');
var models = require('../../../models');
var messageTemplate = '<xml>' +
    '<ToUserName><![CDATA[{to}]]></ToUserName>' +
    '<FromUserName><![CDATA[{from}]]></FromUserName>' +
    '<CreateTime>{createTime}</CreateTime>' +
    '<MsgType><![CDATA[text]]></MsgType>' +
    '<Content><![CDATA[{content}]]></Content>' +
    '</xml>';
/**
 * 在线答疑按钮点击事件
 */
var qOnline = co.wrap(function *(msg) {

    return format(messageTemplate,
        {
            to: msg.FromUserName,
            from: msg.ToUserName,
            createTime: new Date().getTime(),
            content: '在线答疑'
        });

});

module.exports = exports = {
    click: function (msg) {
        var key = msg.EventKey;
        if (key && key === 'q_online') {
            return qOnline(msg);
        }
    }
};
