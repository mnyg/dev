// packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// user Schema
var UserSchema = new Schema({
	name: String,
	username: { type: String, required: true, index: { unique: true }},
	password: { type: String, required: true, select: false }
});

// hash password
UserSchema.pre('save', function(next){
	var user = this;

	// hash password if password is modified or user is new
	if(!user.isModified('password')) return next();

	// generate hash with bcrypt
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if(err) return next(err);

		// change password to hashed version
		user.password = hash;
		next();
	});
});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
	var user = this;

	return bcrypt.comparePassword(password, user.password);
};

// return model
module.exports = mongoose.model('User', UserSchema);