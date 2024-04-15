const { Schema, model } = require('mongoose');

const userSchema = Schema({
	userId: {
		type: String,
		required: true,
	},
	patCounter: {
		type: Number,
		default: 0,
	},
	bapCounter: {
		type: Number,
		default: 0,
	},
});

module.exports = model('userData', userSchema);
