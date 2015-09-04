/**
 * Created by Frank on 15/8/27.
 */
'use strict';
var _ = require('lodash');

module.exports = _.extend(
    require('./activity.model'),
    require('./activityCollect.model')
);
