/**
 * Created by Frank on 15/9/3.
 */
'use strict';
var _ = require('lodash');

module.exports = _.extend(
    require('./homework.model'),
    require('./quiz.model')
);
