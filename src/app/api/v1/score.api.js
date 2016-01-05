/**
 * Created by Frank on 15/7/1.
 */
'use strict';
var models = require('../../models');
var Student = models.Student;
var ScoreExchange = models.ScoreExchange;
var ScoreExchangeInstruction = models.ScoreExchangeInstruction;

var scoreApi = {

    /**
     * 积分商城
     */
    scoreMall: function *() {
        var jwtUser = this.state.jwtUser;
        var schoolId = jwtUser.schoolId;
        var products = yield ScoreExchange.find({
                schoolId: schoolId
            }, '-createdTime -schoolId')
            .sort('score')
            .lean()
            .exec();
        this.body = products || [];
    },

    /**
     * 当前用户积分排名
     */
    scoreRank: function *() {
        var jwtUser = this.state.jwtUser;
        var userId = jwtUser._id;
        var schoolId = jwtUser.schoolId;
        var student = yield Student.findById(userId, 'displayName avatar score').lean().exec();
        if (!student) {
            this.throw(400, '当前学生不存在');
        }
        var score = student.score || 0;
        student.rank = yield Student.find({
            schoolId: schoolId, state: 0,
            score: {$gt: score}
        }).count().exec();
        this.body = student;
    },

    /**
     * 积分榜top10
     */
    scoreTopTen: function *() {
        var jwtUser = this.state.jwtUser;
        var schoolId = jwtUser.schoolId;
        var students = yield Student.find({schoolId: schoolId, state: 0})
            .sort('-score')
            .limit(10)
            .select('displayName username score avatar')
            .lean()
            .exec();
        this.body = students || [];

    },

    /**
     *
     * 积分兑换规则
     *
     */
    exchangeInstruction: function *() {
        var user = this.state.jwtUser;
        var schoolId = user.schoolId;
        var instruction = yield ScoreExchangeInstruction.findOne({schoolId: schoolId}).exec();
        var content = (instruction && instruction.content) || '';
        this.body = content.replace(/\n/g, '<br/>');
    }
};

module.exports = scoreApi;

