const Mongoose = require('mongoose');
const Hash = require('password-hash');
const Schema = Mongoose.Schema;

const UserSchema = new Schema({
	username: { type: String },
	password: { type: String, set: function(newValue) {
		return Hash.isHashed(newValue) ? newValue : Hash.generate(newValue);
	} },
	createAt: { type: Date, default: Date.now },
	// ... add any other properties you want to save with users ...
});

UserSchema.statics.authenticate = function(username, password, callback) {
	this.findOne({ username }, function(error, user) {
		if (user && Hash.verify(password, user.password)) {
			callback(null, user);
		} else if (user || !error) {
			error = new Error("Your username or password is invalid. Please try again.");
			callback(error, null);
		} else {
			// Something bad happened with MongoDB. You shouldn't run into this often.
			callback(error, null);
		}
	})
}

UserSchema.statics.getByUsername = function(username, callback) {
	this.findOne({ username }, callback)
}
exports.User=UserSchema;
