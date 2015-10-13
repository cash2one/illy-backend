/**
 * Created by Frank on 15/10/12.
 */
'use strict';

var _ = require('lodash');
var models = require('../../models');
var Job = require('../../tasks/job');
var Question = models.Question;

var questionApi = {
    create: function *() {
        let user = this.state.jwtUser;
        let question = new Question(this.request.body);
        question.student = user._id;
        question.schoolId = user.schoolId;
        // 如果有图片创建任务去抓取图片到七牛上
        if (question.questionImage) {
            let mediaId = question.questionImage;
            let job = new Job('fetchMedia', {mediaId: mediaId, key: user.schoolId + '/' + mediaId});
            job.save();
        }
        this.body = yield question.save();
    },

    list: function *() {
        let user = this.state.jwtUser;
        let query = this.request.query;
        let offset = query.offset || 0;
        let limit = query.limit || 10;
        let state = query.state;
        this.body = yield Question.find({
            student: user._id,
            state: state
        }).select('questionImage questionText createdTime')
            .sort('-createdTime')
            .limit(limit).skip(offset).lean().exec();
    },

    read: function *() {
        let questionId = this.params.questionId;
        this.body = yield Question.findById(questionId).populate('teacher', 'displayName').lean().exec();
    }

};

module.exports = exports = questionApi;