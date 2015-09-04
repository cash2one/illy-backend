/**
 * Created by Frank on 15/8/26.
 */

'use strict';

var school = require('../../api/v1/school.api');

module.exports = function (api) {

    /**
     * @api {get} /api/v1/school 学校基本信息
     * @apiName  GetSchoolInfo
     * @apiGroup School
     * @apiVersion 0.0.1
     * @apiPermission 认证用户
     * @apiSuccessExample 成功响应示例
     *     HTTP/1.1 200 OK
     *  {
     *   "school": "xxx学校",
     *   "studentCount": "100"
     *  }
     *
     */

    api.get('/school', school.info);


};
