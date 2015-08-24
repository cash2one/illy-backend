/**
 *
 * Created by Frank on 15/7/7.
 */
'use strict';

var kue = require('kue'),
    redis = require('redis'),
    config = require('../../config/config');

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
require('./jobs')(queue);

module.exports = queue;
