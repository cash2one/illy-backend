/**
 * Created by Frank on 15/7/25.
 */

var _ = require('lodash');

module.exports = _.assign(
    require('./post.model'),
    require('./categories.model'),
    require('./visitor.model')
);
