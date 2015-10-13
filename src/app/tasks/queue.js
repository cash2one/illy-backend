/**
 *
 * Created by Frank on 15/7/7.
 */
'use strict';

var kue = require('kue');
var _ = require('lodash');
var redis = require('redis');
var config = require('../../config/config');
var requireDir = require('require-dir');

var queue = kue.createQueue({
    redis: {
        createClientFactory: function () {
            return redis.createClient(config.redis.port, config.redis.host, config.redis.options);
        }
    }
});


queue.on('job enqueue', function (id, type) {
    console.log('Job %s got queued of type %s', id, type);
}).on('job complete', function (id, result) {
    kue.Job.get(id, function (err, job) {
        if (err) return;
        job.remove(function (err) {
            if (err) throw err;
            console.log('removed completed job #%d', job.id);
        });
    });
});

// load job processors
_.forEach(requireDir('./processors'), function (processor) {
    processor(queue);
});

module.exports = queue;

