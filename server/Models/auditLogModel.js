const mongoose = require('mongoose');

const auditLogSchema = mongoose.Schema(
	{
		adminId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: true,
		},
		adminName: {
			type: String,
			required: true,
		},
		action: {
			type: String,
			required: true,
		},
		targetType: {
			type: String,
			enum: ['User', 'Board', 'System'],
			required: true,
		},
		targetId: {
			type: mongoose.Schema.Types.ObjectId,
		},
		details: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('auditLog', auditLogSchema);
