/**
 *
 * Created by Frank on 15/6/26.
 */
'use strict';
var _ = require('lodash');
var math = require('mathjs');
var ruleKeys = require('../../common/constants').scoreRules;
var systemScoreRules = require('../../common/systemScoreRules');
var queue = require('../../tasks');
var models = require('../../models');
var Student = models.Student;
var Homework = models.Homework;
var SchoolScoreRule = models.SchoolScoreRule;

/**
 * 获取未做的作业列表
 */
exports.todoList = function*() {
  var jwtUser = this.state.jwtUser;
  var userId = jwtUser._id;
  var schoolId = jwtUser.schoolId;
  var offset = this.request.query.offset || 0;
  var limit = this.request.query.limit || 10;
  var homeworkList = yield Homework.find({
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
  _.forEach(homeworkList, function (homework) {
    homework.finishedCount = _.filter(homework.performances, function (performance) {
      return performance.state !== 0;
    }).length;
  });
  this.body = homeworkList;

};
/**
 * 错题集
 *
 */
exports.mistakeList = function *() {
  var jwtUser = this.state.jwtUser,
    userId = jwtUser._id,
    schoolId = jwtUser.schoolId,
    offset = this.request.query.offset || 0,
    limit = this.request.query.limit || 10;

  var homeworkList = yield Homework.find({
    schoolId: schoolId,
    performances: {
      $elemMatch: {
        student: userId,
        state: {$in: [1, 2]},
        'wrongCollect.1': {$exists: true}
      }
    }
  }, {performances: {$elemMatch: {student: userId}}})
    .select('title')
    .skip(offset)
    .limit(limit)
    .lean()
    .exec();
  _.forEach(homeworkList, function (homework) {
    homework.wrongNumber = homework.performances[0].wrongCollect.length
  });
  this.body = homeworkList;

};

/**
 * 评语列表
 */
exports.commonList = function *() {

};

/**
 *
 * 获取指定作业
 *
 */
exports.read = function*() {
  var homework = yield Homework.findById(this.params.id)
    .select('title exercises keyPoint keyPointRecord').lean().exec();
  if (!homework || homework.state === 1) {
    this.throw(400, '作业不存在或者已经结束');
  }
  this.body = homework;
};

/**
 * 提交作业
 *
 */
exports.addPerformance = function*() {
  var jwtUser = this.state.jwtUser;
  var homeworkId = this.params.id;
  var postData = this.request.body;
  var studentId = jwtUser._id;
  var numOfExercise = postData.numOfExercise;
  var wrongCount = postData.wrongCollect ? postData.wrongCollect.length : 0;
  var rightCount = numOfExercise - wrongCount;
  _.forEach(postData.audioAnswers, function (audioAnswer) {
    var key = jwtUser.schoolId + '/' + audioAnswer.answer;
    queue.create('qnUpload', {
      key: key,
      mediaId: audioAnswer.answer
    }).save();
    audioAnswer.answer = key + '.mp3';
  });
  // 提交成绩
  yield Homework.update({_id: homeworkId, 'performances.student': studentId}, {
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
  var rightAward = rulesMap.get(ruleKeys.FULL_SCORE_AWARD) ||
      systemScoreRules[ruleKeys.FULL_SCORE_AWARD].value,
    finishedAward = rulesMap.get(ruleKeys.FINISH_HOMEWORK_AWARD) ||
      systemScoreRules[ruleKeys.FINISH_HOMEWORK_AWARD].value,
    factor = rightCount / numOfExercise;
  if (factor < 1) {
    rightAward = math.round(factor * rightAward);
  }
  var totalAward = rightAward + finishedAward;

  // 奖励积分
  var student = yield Student.findByIdAndUpdate(studentId,
    {$inc: {score: totalAward, finishedHomeworkCount: 1}},
    {new: true}).exec();
  this.body = {
    rightAward: rightAward,
    totalAward: totalAward,
    finishedAward: finishedAward,
    rightCount: rightCount,
    wrongCount: wrongCount,
    totalScore: student.score
  };
};
