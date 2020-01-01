const Mongoose = require('mongoose');
const Hash = require('password-hash');
const Schema = Mongoose.Schema;

const ACSchema = new Schema({
    code: { type: String, index: true },
    clientId: { type: String},
    redirectUri: { type: String},
    userId: { type: String},
    username:  { type: String},
    createAt: { type: Date, default: Date.now },
});

ACSchema.statics.getByCode = function(code, done) {
	this.findOne({ code }, done )
}
exports.ACSchema=ACSchema;
