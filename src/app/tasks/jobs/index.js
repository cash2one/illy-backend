/**
 * Created by Frank on 15/7/7.
 */

'use strict';

var _ = require('lodash');
var requireDir = require('require-dir');

module.exports = function (queue) {

    _.forEach(requireDir('./processors'), function (processor) {
        processor(queue);
    });

};
