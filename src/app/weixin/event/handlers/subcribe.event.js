/**
 * Created by Frank on 15/7/6.
 */

'use strict';

var co = require('co');
var _ = require('lodash');
var models = require('../../../models');
var Job = require('../../../tasks/job');

var handlers = {

    /**
     *
     * 处理关注事件
     * @param ctx
     *
     */
    subscribe: co.wrap(function *(msg) {
        const DEFAULT_MESSAGE = '欢迎加入家校云';
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

        var scene = msg.EventKey && msg.EventKey.split('_');
        if (!scene || scene.length <= 1) {
            return replay(DEFAULT_MESSAGE);
        }
        var school = yield models.School.findOne({username: scene[1]}, '_id schoolName').lean().exec();
        if (!school) {
            return replay(DEFAULT_MESSAGE);
        }
        yield models.Visitor.findOneAndUpdate({
            schoolId: school._id,
            openid: replayTo
        }, {createdTime: Date.now()}, {upsert: true}).exec();

        return replay('欢迎加入 [' + school.schoolName + ']' + '家校云。');
    }),

    /**
     *
     * 处理取消关注事件
     * @param msg
     *
     */
    unSubscribe: co.wrap(function* (msg) {
        //将任务添加至任务队列中
        let job = new Job('unSubscribe', {openid: msg.FromUserName});
        job.save();
        return '';
    })
};

module.exports = exports = handlers;


