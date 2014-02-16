/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
	email: {
		type: 'string',
		required: true,
		email: true,
		unique: true
	},
	password: {
		type: 'string',
		required: true
	},

	toJSON: function() {
		var obj = this.toObject();
		delete obj.password;
		return obj;
	}  	 
},

	beforeCreate: function(values, next) {
		hasPassword(values, next);
	},
	beforeUpdate: function(values, next) {
		if(values.password) hasPassword(values, next);
		else next();
	}

};

var bcrypt = require('bcrypt');

function hasPassword(values, next) {
	bcrypt.hash(values.password, 10, function(err, hash){
		if (err) return next(err);
		values.password = hash;
		next();
	})
}
