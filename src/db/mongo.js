/**
 * Created by Frank on 15/6/23.
 */
'use strict';
var mongoose = require('mongoose');
var db = require('../config/config').db;

// Create the database connection
mongoose.connect(db.uri, db.options);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + db.uri);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.error('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.warn('Mongoose default connection disconnected');
});

// When the connection is open
mongoose.connection.on('open', function () {
    console.log('Mongoose default connection is open');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});
