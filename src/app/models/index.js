/**
 * Created by Frank on 15/7/25.
 */

'use strict';
var _ = require('lodash');

module.exports = _.extend(
    require('./homework'),
    require('./media'),
    require('./score'),
    require('./site'),
    require('./task'),
    require('./user'),
    require('./schedule.model'),
    require('./class.model'),
    require('./communicationRecord.model'),
    require('./counter.model')
);
