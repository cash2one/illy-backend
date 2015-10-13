/**
 * Created by Frank on 15/10/13.
 */
'use strict';
var queue = require('./queue');

function Job(name, data) {
    this.name = name;
    this.data = data;
    this.job = queue.create(this.name, this.data).save();
    this.isSave = false;
}

Job.prototype = {
    complete: function (callback) {
        this.job.on('complete', callback);
        return this;
    },

    faild: function (callback) {
        this.job.on('failed', callback);
        return this;
    },

    failAttempte: function (callback) {
        this.job.on('failed attempte', callback);
        return this;
    },

    attempts: function (times, backoff) {
        this.job.attempts(times).backoff(backoff);
        return this;
    },

    save: function () {
        if (this.isSave) return this;
        this.job.save();
        this.isSave = true;
        return this;
    }
};

exports = module.exports = Job;
