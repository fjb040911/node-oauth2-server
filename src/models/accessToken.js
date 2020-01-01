const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const AccessTokenSchema = new Schema({
    token: { type: String, index: true },
    userId: { type: String},
    clientId: { type: String},
    createAt: { type: Date, default: Date.now },
});

AccessTokenSchema.statics.getByCode = function(token, done) {
	this.findOne({ token }, done)
}

AccessTokenSchema.static.getByUserAndClient = function(userId, clientId, done) {
    this.findOne({ userId, clientId }, done)
}
exports.AccessToken=AccessTokenSchema;
