const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	surname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
	},
	color: {
		type: String,
	},
	boards: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'board',
		},
	],
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user',
	},
	isBanned: {
		type: Boolean,
		default: false,
	},
	loginAttempts: {
		type: Number,
		default: 0,
	},
	lockUntil: {
		type: Date,
	},
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);
