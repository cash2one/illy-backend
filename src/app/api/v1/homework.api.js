/**
 *
 * Created by Frank on 15/6/26.
 */
'use strict';
var _ = require('lodash');
var math = require('mathjs');
var mongoose = require('mongoose');
var Job = require('../../tasks/job');
var qn = require('../../qiniu');
var Student = mongoose.model('Student');
var Homework = mongoose.model('Homework');
var ScoreLog = mongoose.model('ScoreLog');


var homeworkApi = {
    /**
     * 获取未做的作业列表
     */
    todoList: function*() {
        var user = this.state.jwtUser;
        var userId = user._id;
        var schoolId = user.schoolId;
        var offset = this.request.query.offset || 0;
        var limit = this.request.query.limit || 10;
        this.body = yield Homework.find({
            schoolId: schoolId,
            state: 0,
            performances: {
                $elemMatch: {
                    student: userId,
                    state: 0
                }
            }
        }).select('title createdTime finishAward performanceAward statistics.studentCountOfFinished')
            .skip(offset)
            .limit(limit)
            .sort('-createdTime')
            .lean()
            .exec();
    },

    /**
     * 错题集
     *
     */
    mistakeList: function *() {
        var jwtUser = this.state.jwtUser;
        var userId = jwtUser._id;
        var schoolId = jwtUser.schoolId;
        var offset = this.request.query.offset || 0;
        var limit = this.request.query.limit || 10;
        var homeworkList = yield Homework.find({
                schoolId: schoolId,
                performances: {
                    $elemMatch: {
                        student: userId,
                        state: {$in: [1, 2]},
                        'wrongCollect.0': {$exists: true}
                    }
                }
            }, {performances: {$elemMatch: {student: userId}}})
            .select('title')
            .skip(offset)
            .limit(limit)
            .sort('-createdTime')
            .lean()
            .exec();

        _.forEach(homeworkList, function (homework) {
            var performance = homework.performances[0];
            homework.wrongNumber = performance.wrongCollect.length;
            homework.finishedTime = performance.finishedTime;
        });
        this.body = homeworkList;

    },

    /**
     * 错题详情
     */
    mistakeDetail: function *() {
        var jwtUser = this.state.jwtUser,
            userId = jwtUser._id,
            homeworkId = this.params.homeworkId;
        var homework = yield   Homework.findOne({_id: homeworkId},
            {performances: {$elemMatch: {student: userId}}})
            .select('title quiz')
            .populate('quiz', 'exercises')
            .lean().exec();
        var performance = homework.performances[0];
        var exercises = homework.quiz.exercises;
        var wrongExercises = [];
        if (performance) {
            performance.homework = homework.title;
            var wrongCollect = performance.wrongCollect;
            // 标记错题
            if (!_.isEmpty(wrongCollect)) {
                _.forEach(wrongCollect, function (wrong) {
                    var exercise = exercises[wrong.sequence - 1];
                    exercise.wrongAnswer = wrong.answer;
                    wrongExercises.push(exercise);
                });
            }
        }
        this.body = wrongExercises;
    },

    /**
     * 评语列表
     */
    commonList: function *() {
        var jwtUser = this.state.jwtUser;
        var userId = jwtUser._id;
        var schoolId = jwtUser.schoolId;
        var offset = this.request.query.offset || 0;
        var limit = this.request.query.limit || 10;
        var homeworkList = yield Homework.find({
                schoolId: schoolId,
                performances: {
                    $elemMatch: {
                        student: userId,
                        state: {$in: [1, 2]}
                    }
                }
            }, {performances: {$elemMatch: {student: userId}}})
            .select('title createdTime creator')
            .skip(offset)
            .sort('-createdTime')
            .limit(limit)
            .lean()
            .exec();

        _.forEach(homeworkList, function (homework) {
            homework.comment = homework.performances[0].comment;
            delete homework.performances;
        });

        this.body = homeworkList;
    },


    /**
     *
     * 获取指定作业
     *
     */
    read: function*() {
        var homework = yield Homework.findById(this.params.id)
            .select('title quiz keyPoint keyPointRecord')
            .populate('quiz', 'exercises')
            .lean()
            .exec();
        if (!homework || homework.state === 1) {
            this.throw(400, '作业不存在或者已经结束');
        }
        this.body = homework;
    },

    /**
     * 提交作业
     *
     */
    addPerformance: function*() {
        let jwtUser = this.state.jwtUser;
        let homeworkId = this.params.id;
        let postData = this.request.body;
        let studentId = jwtUser._id;
        let numOfExercise = postData.numOfExercise;
        let wrongCollect = [];
        let suggestedAnswers = postData.suggestedAnswers;
        let localAnswers = postData.localAnswers;
        let spendSeconds = postData.spendSeconds;
        //let rightCount = numOfExercise - wrongCount;
        let fetches = [];
        let keys = [];
        _.forEach(postData.audioAnswers, audioAnswer=> {
            let mediaId = audioAnswer.answer;
            let key = jwtUser.schoolId + '/' + audioAnswer.answer;
            keys.push(key);
            fetches.push(qn.fetchFromWeixin(mediaId, key));
            audioAnswer.answer = key + '.mp3';
        });
        try {
            yield fetches;
        } catch (err) {
            console.error(err);
            this.throw(400, '语音题上传失败!');
        }
        _.forEach(keys, key => new Job('convertToMp3', {key: key}).save());

        //比较对错
        let len_l = localAnswers.length;
        let len_s = suggestedAnswers.length;
        if (len_l === len_s) {
            for (var index = 0; index < len_l; index++) {
                if (typeof localAnswers[index] == "string") {
                    if (suggestedAnswers[index] !== localAnswers[index].trim()) {
                        //这个地方待会要再改
                        //题目的索引从1开始的
                        wrongCollect.push({sequence: index + 1, answer: localAnswers[index]});
                    }
                }
            }
        }
        let wrongCount = wrongCollect.length;
        let rightCount = numOfExercise - wrongCount;
        let homework = yield Homework.findOne({_id: homeworkId},
            {performances: {$elemMatch: {student: studentId}}})
            .select('state finishAward performanceAward')
            .lean()
            .exec();
        if (!homework || homework.state !== 0 || homework.performances.length === 0) {
            this.throw(400, '作业已经结束!');
        }
        let performance = homework.performances[0];
        if (performance.state !== 0) {
            this.throw(400, '作业已经提交!');
        }
        let finishAward = homework.finishAward;
        let performanceAward = homework.performanceAward;
        let factor = rightCount / numOfExercise;
        if (factor < 1) {
            performanceAward = math.floor(factor * performanceAward);
        }
        let totalAward = finishAward + performanceAward;
        // 提交成绩
        yield Homework.update({_id: homeworkId, 'performances.student': studentId}, {
            $set: {
                'performances.$': _.assign(postData, {
                    wrongCollect: wrongCollect,
                    student: studentId,
                    award: totalAward,
                    spendSeconds: spendSeconds,
                    finishedTime: new Date(),
                    state: 1
                })
            },
            $inc: {
                'statistics.studentCountOfFinished': 1
            }
        }).exec();
        // 奖励积分
        let student = yield Student.findByIdAndUpdate(studentId, {
            $inc: {
                score: totalAward,
                finishedHomeworkCount: 1
            }
        }, {'new': true}).exec();
        let scoreLog = new ScoreLog({
            student: student,
            value: totalAward,
            operation: 0,
            remark: '作业奖励',
            schoolId: jwtUser.schoolId
        });
        yield scoreLog.save();
        this.body = {
            totalAward: totalAward,
            rightCount: rightCount,
            wrongCount: wrongCount,
            totalScore: student.score
        };
    }
};

module.exports = homeworkApi;
