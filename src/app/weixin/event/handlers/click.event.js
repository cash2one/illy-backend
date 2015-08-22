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

/**
 * 在线答疑按钮点击事件
 */
function * qOnline(msg) {
    var student = yield models.Student.findOne({openids: msg.ToUserName}).exec();


}


module.exports.click = co.wrap(function *(msg) {
    var key = msg.EventKey;
    if (key && key === 'q_online') {
        yield *qOnline(msg);
    }
});
