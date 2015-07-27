/**
 * Created by Frank on 15/7/1.
 */

var models = require('../../models');
var Student = models.Student;
var ScoreExchange = models.ScoreExchange;


/**
 *
 * 积分商城
 *
 */
exports.scoreMall = function *() {
  var jwtUser = this.state.jwtUser;
  var schoolId = jwtUser.schoolId;
  var offset = this.request.query.offset || 0;
  var limit = this.request.query.limit || 10;
  var products = yield ScoreExchange.find({
    schoolId: schoolId
  }, '-createdTime -schoolId')
    .skip(offset)
    .limit(limit)
    .lean()
    .exec();
  this.body = products || [];
};

/**
 * 当前用户积分排名
 */
exports.scoreRank = function *() {
  var jwtUser = this.state.jwtUser;
  var userId = jwtUser._id;
  var schoolId = jwtUser.schoolId;
  var student = yield Student.findById(userId, 'score -_id').lean().exec();
  if (!student) {
    this.throw(400, '当前学生不存在');
  }
  var score = student.score || 0;
  var count = yield Student.find({
    schoolId: schoolId, state: 0,
    score: {$gt: score}
  }).count().exec();
  this.body = {
    score: score,
    rank: count + 1
  };
};

/**
 * 积分榜top10
 */
exports.scoreTopTen = function *() {
  var jwtUser = this.state.jwtUser;
  var schoolId = jwtUser.schoolId;
  var students = yield Student.find({schoolId: schoolId, state: 0})
    .sort('-score')
    .limit(10)
    .select('displayName username score avatar -_id')
    .lean()
    .exec();
  this.body = students || [];

};
