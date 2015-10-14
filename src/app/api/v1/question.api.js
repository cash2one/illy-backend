/**
 * Created by Frank on 15/10/12.
 */
'use strict';
var _ = require('lodash');
var models = require('../../models');
var qn = require('../../qiniu');
var Question = models.Question;

var questionApi = {
    /**
     * 创建新提问
     */
    create: function *() {
        let user = this.state.jwtUser;
        let question = new Question(this.request.body);
        question.student = user._id;
        question.schoolId = user.schoolId;
        if (!question.questionImage && !question.questionText) {
            this.throw(400, '没有提问的内容');
        }
        // 如果有图片创建任务去抓取图片到七牛上
        if (question.questionImage) {
            let mediaId = question.questionImage;
            let key = user.schoolId + '/' + mediaId;
            question.questionImage = key;
            try {
                yield qn.fetchFromWeixin(mediaId, key);
            } catch (err) {
                this.throw(400, '上传图片失败');
            }
        }
        this.body = yield question.save();
    },

    /**
     * 列出当前学生的提问
     */
    list: function *() {
        let user = this.state.jwtUser;
        let offset = this.query.offset || 0;
        let limit = this.query.limit || 10;
        let state = parseInt(this.query.state);
        let query = Question.find({student: user._id});
        if (!isNaN(state)) {
            query.where('state', state);
        }
        query.select('questionImage questionText createdTime')
            .sort('-createdTime').limit(limit).skip(offset);
        this.body = yield query.lean().exec();
    },

    /**
     * 读取提问详情
     */
    read: function *() {
        let questionId = this.params.questionId;
        this.body = yield Question.findById(questionId).populate('teacher', 'displayName').lean().exec();
    }

};

module.exports = exports = questionApi;
