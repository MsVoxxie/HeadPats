const { Schema, model } = require('mongoose');

const userSchema = Schema({
	userId: {
		type: String,
		required: true,
	},
	patsGiven: {
		type: Number,
		default: 0,
	},
	patsReceived: {
		type: Number,
		default: 0,
	},
	bapsGiven: {
		type: Number,
		default: 0,
	},
	bapsReceived: {
		type: Number,
		default: 0,
	},
	userGuilds: {
		type: Array,
		required: true,
	},
});

module.exports = model('userData', userSchema);
