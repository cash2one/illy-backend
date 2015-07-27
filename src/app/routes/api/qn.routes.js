/**
 * Created by Frank on 15/7/24.
 */


'use strict';
var qn = require('../../api/v1/qn.api');
module.exports = function (api) {
  api.post('/public/qn/persistentNotify', qn.persistentNotify);
};
