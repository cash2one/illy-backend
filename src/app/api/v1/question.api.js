/**
 * Created by Frank on 15/10/12.
 */
'use strict';

var models = require('../../models');
var Question = models.Question;

var questionApi = {
    addQuestion: function *() {
        let user = this.state.jwtUser;
        let question = new Question(this.request.body);
        question.student = user._id;
        question.schoolId = user.schoolId;
    }

};
