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
var api = require('../../api');

/**
 * 在线答疑按钮点击事件
 */
var qOnline = co.wrap(function *(msg) {
    let replayTo = msg.FromUserName;
    api.sendMessage(replayTo, '即将开通');
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
