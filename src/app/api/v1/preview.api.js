/**
 * Created by Frank on 15/6/26.
 */

'use strict';
var _ = require('lodash');
var models = require('../../models');
var systemScoreRules = require('../../common/systemScoreRules');
var ruleKeys = require('../../common/constants').scoreRules;
var SchoolScoreRule = models.SchoolScoreRule;
var Preview = models.Preview;
var Student = models.Student;
var previewApi = {
    /**
     * 获取未做的预习列表
     */
    todoList: function*() {
        var jwtUser = this.state.jwtUser;
        var userId = jwtUser._id;
        var schoolId = jwtUser.schoolId;
        var offset = this.request.query.offset || 0;
        var limit = this.request.query.limit || 10;
        var previews = yield Preview.find({
            schoolId: schoolId,
            state: 0,
            performances: {
                $elemMatch: {
                    student: userId,
                    state: 0
                }
            }
        }).select('title startTime endTime performances.state')
            .skip(offset)
            .limit(limit)
            .lean()
            .exec();
        _.forEach(previews, function (review) {
            review.finishedCount = _.filter(review.performances, function (performance) {
                return performance.state !== 0;
            }).length;
        });
        this.body = previews || [];
    },

    /**
     * 获取指定预习
     */
    read: function*() {
        var preview = yield Preview.findById(this.params.id)
            .select('title exercises keyPoint keyPointRecord').lean().exec();
        if (!preview || preview.state === 1) {
            this.throw(400, '预习不存在或者已经结束');
        }
        this.body = preview;
    },

    /**
     * 提交预习
     */
    addPerformance: function*() {
        var jwtUser = this.state.jwtUser;
        var previewId = this.params.id;
        var postData = this.request.body;
        var studentId = jwtUser._id;
        _.forEach(postData.audioAnswers, function (audioAnswer) {
            var key = jwtUser.schoolId + '/' + audioAnswer.answer;
            queue.create('qnUpload', {
                key: key,
                mediaId: audioAnswer.answer
            }).attempts(2).save();
            audioAnswer.answer = key + '.mp3';
        });
        // 提交成绩
        yield Preview.update({_id: previewId, 'performances.student': studentId}, {
            $set: {
                'performances.$': _.assign(postData, {
                    student: studentId,
                    finishedTime: new Date(),
                    state: 1
                })
            }
        }).exec();
        // 获取学校积分奖励规则
        var rules = yield SchoolScoreRule.find({schoolId: jwtUser.schoolId}, 'key value -_id').exec();
        var rulesMap = new Map();
        _.forEach(rules, function (rule) {
            rulesMap.set(rule.key, rule.value);
        });
        var finishedAward = rulesMap.get(ruleKeys.FINISH_PREVIEW_AWARD) ||
            systemScoreRules[ruleKeys.FINISH_PREVIEW_AWARD].value;
        // 奖励积分
        var student = yield Student.findByIdAndUpdate(studentId,
            {$inc: {score: finishedAward, finishedHomeworkCount: 1}},
            {new: true}).exec();
        this.body = {
            finishedAward: finishedAward,
            totalScore: student.score
        };
    }
};

module.exports = previewApi;
