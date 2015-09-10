/**
 * Created by Frank on 15/8/26.
 */
'use strict';
var models = require('../../models');
var School = models.School;
var Student = models.Student;

var schoolApi = {

    info: function *() {
        var jwtUser = this.state.jwtUser;
        var schoolId = jwtUser.schoolId;
        var school = yield  School.findById(schoolId, 'schoolName').lean().exec();
        if (!school) {
            this.throw(404, '学校不存在');
        }
        var studentCount = yield Student.count({
            schoolId: schoolId,
            state: 0
        }).exec();

        this.body = {
            school: school.schoolName,
            studentCount: studentCount
        };
    }

};

module.exports = exports = schoolApi;
