/**
 * Created by Frank on 15/7/25.
 */

var _ = require('lodash');

module.exports = _.extend(
    require('./activity.model'),
    require('./activityCollect.model'),
    require('./task.model'),
    require('./taskCollect.model')
);
