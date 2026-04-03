const userModel = require('../Models/userModel');
const boardModel = require('../Models/boardModel');
const cardModel = require('../Models/cardModel');
const auditLogModel = require('../Models/auditLogModel');
const settingModel = require('../Models/settingModel');

// --- User Management ---

const getAllUsers = async (req, res) => {
	try {
		const { search } = req.query;
		let query = {};
		if (search) {
			query = {
				$or: [
					{ name: { $regex: search, $options: 'i' } },
					{ surname: { $regex: search, $options: 'i' } },
					{ email: { $regex: search, $options: 'i' } },
				],
			};
		}
		const users = await userModel.find(query).select('-password');
		
		// Add some stats for each user (number of boards)
		const usersWithStats = users.map(user => ({
			...user._doc,
			boardCount: user.boards.length
		}));

		res.status(200).send(usersWithStats);
	} catch (error) {
		res.status(500).send({ errMessage: error.message });
	}
};

const toggleBanUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const user = await userModel.findById(userId);
		if (!user) return res.status(404).send({ errMessage: 'User not found' });

		user.isBanned = !user.isBanned;
		await user.save();

		// Log activity
		await auditLogModel.create({
			adminId: req.user.id,
			adminName: req.user.name,
			action: user.isBanned ? 'Banned user' : 'Unbanned user',
			targetType: 'User',
			targetId: user._id,
			details: `User email: ${user.email}`
		});

		res.status(200).send({ message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`, isBanned: user.isBanned });
	} catch (error) {
		res.status(500).send({ errMessage: error.message });
	}
};

const updateUserRole = async (req, res) => {
	try {
		const { userId } = req.params;
		const { role } = req.body;
		if (!['user', 'admin'].includes(role)) return res.status(400).send({ errMessage: 'Invalid role' });

		const user = await userModel.findByIdAndUpdate(userId, { role }, { new: true });
		
		// Log activity
		await auditLogModel.create({
			adminId: req.user.id,
			adminName: req.user.name,
			action: 'Updated user role',
			targetType: 'User',
			targetId: user._id,
			details: `New role: ${role} for ${user.email}`
		});

		res.status(200).send({ message: 'Role updated successfully', user });
	} catch (error) {
		res.status(500).send({ errMessage: error.message });
	}
};

// --- Board Moderation ---

const getAllBoards = async (req, res) => {
	try {
		const boards = await boardModel.find({}).populate('members.user', 'name surname email');
		res.status(200).send(boards);
	} catch (error) {
		res.status(500).send({ errMessage: error.message });
	}
};

const toggleDeleteBoard = async (req, res) => {
	try {
		const { boardId } = req.params;
		const board = await boardModel.findById(boardId);
		if (!board) return res.status(404).send({ errMessage: 'Board not found' });

		board.isDeleted = !board.isDeleted;
		board.deletedAt = board.isDeleted ? new Date() : null;
		await board.save();

		// Log activity
		await auditLogModel.create({
			adminId: req.user.id,
			adminName: req.user.name,
			action: board.isDeleted ? 'Soft deleted board' : 'Restored board',
			targetType: 'Board',
			targetId: board._id,
			details: `Board title: ${board.title}`
		});

		res.status(200).send({ message: `Board ${board.isDeleted ? 'deleted' : 'restored'} successfully`, isDeleted: board.isDeleted });
	} catch (error) {
		res.status(500).send({ errMessage: error.message });
	}
};

// --- Analytics ---

const getStats = async (req, res) => {
	try {
		const totalUsers = await userModel.countDocuments();
		const totalBoards = await boardModel.countDocuments({ isDeleted: false });
		const totalCards = await cardModel.countDocuments();

		// Growth over last 6 months (simple version)
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
		
		const growth = await userModel.aggregate([
			{ $match: { createdAt: { $gte: sixMonthsAgo } } },
			{
				$group: {
					_id: { $month: "$createdAt" },
					count: { $sum: 1 }
				}
			},
			{ $sort: { "_id": 1 } }
		]);

		// Task completion stats
		// Note: This depends on how 'Done' is defined. Assuming a list named 'Done' or a completed flag in card.
		// For this project, let's assume cards in lists with 'done' in title are completed.
		// Or if cardModel has a completed flag. Checking cardModel...
		
		res.status(200).send({
			summary: { totalUsers, totalBoards, totalCards },
			growth
		});
	} catch (error) {
		res.status(500).send({ errMessage: error.message });
	}
};

// --- Settings & Logs ---

const getAuditLogs = async (req, res) => {
	try {
		const logs = await auditLogModel.find().sort({ createdAt: -1 }).limit(100);
		res.status(200).send(logs);
	} catch (error) {
		res.status(500).send({ errMessage: error.message });
	}
};

const updateSystemNotification = async (req, res) => {
	try {
		const { message, active } = req.body;
		await settingModel.findOneAndUpdate(
			{ key: 'system_notification' },
			{ value: { message, active }, key: 'system_notification' },
			{ upsert: true, new: true }
		);

		// Log action
		await auditLogModel.create({
			adminId: req.user.id,
			adminName: req.user.name,
			action: 'Updated system notification',
			targetType: 'System',
			details: `Message: ${message}, Active: ${active}`
		});

		res.status(200).send({ message: 'Notification updated successfully' });
	} catch (error) {
		res.status(500).send({ errMessage: error.message });
	}
};

const getSystemNotification = async (req, res) => {
	try {
		const setting = await settingModel.findOne({ key: 'system_notification' });
		res.status(200).send(setting ? setting.value : { message: '', active: false });
	} catch (error) {
		res.status(500).send({ errMessage: error.message });
	}
};

module.exports = {
	getAllUsers,
	toggleBanUser,
	updateUserRole,
	getAllBoards,
	toggleDeleteBoard,
	getStats,
	getAuditLogs,
	updateSystemNotification,
	getSystemNotification
};
