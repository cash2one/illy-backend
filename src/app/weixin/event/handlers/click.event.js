/**
 * Created by Frank on 15/8/22.
 *
 * 处理menu点击事件
 *
 */

'use strict';
var co = require('co');
var _ = require('lodash');
var models = require('../../../models');

/**
 * 在线答疑按钮点击事件
 */
var qOnline = co.wrap(function *(msg) {
    let replayTo = msg.FromUserName;
    let replayFrom = msg.ToUserName;
    let createTime = new Date().getTime();
    let replay = content => `<xml>
            <ToUserName><![CDATA[${replayTo}]]></ToUserName>
            <FromUserName><![CDATA[${replayFrom}]]></FromUserName>
            <CreateTime>${createTime}</CreateTime>
            <MsgType><![CDATA[text]]></MsgType>
            <Content><![CDATA[${content}]]></Content>
        </xml>`;

    return replay('即将开通')

});

module.exports = exports = {
    click: function (msg) {
        var key = msg.EventKey;
        if (key && key === 'q_online') {
            return qOnline(msg);
        }
        return "";
    }
};
