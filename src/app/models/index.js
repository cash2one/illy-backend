/**
 * Created by Frank on 15/7/25.
 */

'use strict';
var _ = require('lodash');

module.exports = _.assign(
    require('./homework'),
    require('./media'),
    require('./score'),
    require('./site'),
    require('./task'),
    require('./user'),
    require('./system'),
    require('./class.model')
);
