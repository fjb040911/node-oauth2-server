const mongoose = require('mongoose');
const config = require('../config');
const app = mongoose.createConnection(config.db, function (err) {
    if (err) {
        console.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }
});

const authUser = require('./user').User;
const client = require('./client').Client;
const acs = require('./authorizationCodes').ACSchema;
const accessToken = require('./accessToken').AccessToken;

exports.User = app.model('AuthUser', authUser);
exports.Client = app.model('Client', client);
exports.AuthorizationCodes = app.model('AuthorizationCode', acs);
exports.AccessToken = app.model('AccessToken', accessToken);
