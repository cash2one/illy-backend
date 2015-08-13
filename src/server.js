/**
 * Main application file
 */

'use strict';
var heapdump = require('heapdump');

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/config'),
    chalk = require('chalk');

// connect to mongodb
require('./db/mongo');

// Bootstrap server
var app = require('koa')();
require('./config/koa')(app);

// Start server
app.listen(config.port, config.ip, function () {
    console.log('Koa server listening on %d, in %s mode', config.port, config.env);
});

// Expose app
exports = module.exports = app;

// Print runtime env info
console.log('--');
console.log(chalk.green(config.app.title + ' application started'));
console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
console.log(chalk.green('Port:\t\t\t\t' + config.port));
console.log(chalk.green('Database:\t\t\t' + config.db.uri));

console.log('--');
