/**
 *
 * Created by Frank on 15/7/25.
 */

'use strict';

var _ = require('lodash');

module.exports = _.extend(
    require('./media.model'),
    require('./mediaGroup.model')
);
