const Mongoose = require('mongoose');
const Hash = require('password-hash');
const Schema = Mongoose.Schema;

const ClientSchema = new Schema({
    name: { type: String },
    clientId: { type: String },
    clientSecret: { type: String, index: true },
    agent: { type: String },
    ip: { type: String },
    isTrusted: {type: Boolean, default: false},
    createAt: { type: Date, default: Date.now },
});

ClientSchema.statics.getById = function(_id, done) {
	this.findOne({ _id }, done )
}

ClientSchema.statics.getByClientId = function(clientId, done) {
	this.findOne({ clientId }, done )
}

exports.Client=ClientSchema;
