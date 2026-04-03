const { findOne } = require('../Models/boardModel');
const boardModel = require('../Models/boardModel');
const userModel = require('../Models/userModel');

const create = async (req, callback) => {
	try {
		const { title, backgroundImageLink } = req.body;
		// Create and save new board
		let newBoard = boardModel({ title, backgroundImageLink });
		newBoard.save();

		// Add this board to owner's boards
		const user = await userModel.findById(req.user.id);
		user.boards.unshift(newBoard.id);
		await user.save();

		// Add user to members of this board as joined owner
		let allMembers = [];
		allMembers.push({
			user: user.id,
			name: user.name,
			surname: user.surname,
			email: user.email,
			color: user.color,
			role: 'owner',
			status: 'joined',
		});

		// Add created activity to activities of this board
		newBoard.activity.unshift({ user: user._id, name: user.name, action: 'created this board', color: user.color });

		// Save new board
		newBoard.members = allMembers;
		await newBoard.save();

		return callback(false, newBoard);
	} catch (error) {
		return callback({
			errMessage: 'Something went wrong',
			details: error.message,
		});
	}
};

const getAll = async (userId, callback) => {
	try {
		// Get user
		const user = await userModel.findById(userId);

		// Get board's ids of user
		const boardIds = user.boards;

		// Get boards of user
		const boards = await boardModel.find({ _id: { $in: boardIds } });

		// Delete unneccesary objects
		boards.forEach((board) => {
			board.activity = undefined;
			board.lists = undefined;
		});

		return callback(false, boards);
	} catch (error) {
		return callback({ msg: 'Something went wrong', details: error.message });
	}
};

const getById = async (id, callback) => {
	try {
		// Get board by id
		const board = await boardModel.findById(id);
		return callback(false, board);
	} catch (error) {
		return callback({ message: 'Something went wrong', details: error.message });
	}
};

const getActivityById = async (id, callback) => {
	try {
		// Get board by id
		const board = await boardModel.findById(id);
		return callback(false, board.activity);
	} catch (error) {
		return callback({ message: 'Something went wrong', details: error.message });
	}
};

const updateBoardTitle = async (boardId, title, user, callback) => {
	try {
		// Get board by id
		const board = await boardModel.findById(boardId);
		board.title = title;
		board.activity.unshift({
			user: user._id,
			name: user.name,
			action: 'update title of this board',
			color: user.color,
		});
		await board.save();
		return callback(false, { message: 'Success!' });
	} catch (error) {
		return callback({ message: 'Something went wrong', details: error.message });
	}
};

const updateBoardDescription = async (boardId, description, user, callback) => {
	try {
		// Get board by id
		const board = await boardModel.findById(boardId);
		board.description = description;
		board.activity.unshift({
			user: user._id,
			name: user.name,
			action: 'update description of this board',
			color: user.color,
		});
		await board.save();
		return callback(false, { message: 'Success!' });
	} catch (error) {
		return callback({ message: 'Something went wrong', details: error.message });
	}
};

const updateBackground = async (id, background, isImage, user, callback) => {
	try {
		// Get board by id
		const board = await boardModel.findById(id);

		// Set variables
		board.backgroundImageLink = background;
		board.isImage = isImage;

		// Log the activity
		board.activity.unshift({
			user: user._id,
			name: user.name,
			action: 'update background of this board',
			color: user.color,
		});

		// Save changes
		await board.save();

		return callback(false, board);
	} catch (error) {
		return callback({ message: 'Something went wrong', details: error.message });
	}
};

const addMember = async (id, members, user, callback) => {
	try {
		// Get board by id
		const board = await boardModel.findById(id);

		// Set variables
		await Promise.all(
			members.map(async (member) => {
				const newMember = await userModel.findOne({ email: member.email });
				if (newMember) {
					// Check if already a member (pending or joined)
					const existingMember = board.members.find(m => m.user.toString() === newMember._id.toString());
					if (existingMember) return;

					board.members.push({
						user: newMember._id,
						name: newMember.name,
						surname: newMember.surname,
						email: newMember.email,
						color: newMember.color,
						role: 'member',
						status: 'pending', // Set as pending, user needs to accept
					});
					//Add to board activity
					board.activity.push({
						user: user.id,
						name: user.name,
						action: `invited user '${newMember.name}' to this board`,
						color: user.color,
					});
				}
				// Skip if user not found as per new requirement:
				// "chưa được hiển thị vào boards chỉ những user đã vào boards mới được hiển thị"
			})
		);
		// Save changes
		await board.save();

		return callback(false, board.members);
	} catch (error) {
		return callback({ message: 'Something went wrong', details: error.message });
	}
};

const acceptInvitation = async (boardId, userId, callback) => {
	try {
		const board = await boardModel.findById(boardId);
		if (!board) return callback({ errMessage: 'Board not found!' });

		const memberIndex = board.members.findIndex(m => m.user.toString() === userId && m.status === 'pending');
		if (memberIndex === -1) return callback({ errMessage: 'Invitation not found or already accepted!' });

		board.members[memberIndex].status = 'joined';
		
		const user = await userModel.findById(userId);
		if (!user.boards.includes(boardId)) {
			user.boards.unshift(boardId);
			await user.save();
		}

		board.activity.unshift({
			user: userId,
			name: user.name,
			action: 'accepted the invitation and joined the board',
			color: user.color,
		});

		await board.save();
		return callback(false, { message: 'Invitation accepted!' });
	} catch (error) {
		return callback({ errMessage: error.message });
	}
};

const rejectInvitation = async (boardId, userId, callback) => {
	try {
		const board = await boardModel.findById(boardId);
		if (!board) return callback({ errMessage: 'Board not found!' });

		board.members = board.members.filter(m => !(m.user.toString() === userId && m.status === 'pending'));
		await board.save();
		return callback(false, { message: 'Invitation rejected!' });
	} catch (error) {
		return callback({ errMessage: error.message });
	}
};

const getInvitations = async (userId, callback) => {
	try {
		const boards = await boardModel.find({
			'members': {
				$elemMatch: {
					user: userId,
					status: 'pending'
				}
			}
		}).select('title backgroundImageLink isImage members');
		
		return callback(false, boards);
	} catch (error) {
		return callback({ errMessage: error.message });
	}
};

const removeMember = async (boardId, userId, requesterId, callback) => {
	try {
		const board = await boardModel.findById(boardId);
		if (!board) return callback({ errMessage: 'Board not found!' });

		// Check if requester is owner
		const requester = board.members.find(m => m.user.toString() === requesterId);
		if (!requester || requester.role !== 'owner') {
			return callback({ errMessage: 'Only board owner can remove members!' });
		}

		// Find member to remove
		const memberIndex = board.members.findIndex(m => m.user.toString() === userId);
		if (memberIndex === -1) return callback({ errMessage: 'Member not found in this board!' });

		const memberToRemove = board.members[memberIndex];

		// If member was joined, remove board from their user.boards
		if (memberToRemove.status === 'joined') {
			const user = await userModel.findById(userId);
			if (user) {
				user.boards = user.boards.filter(b => b.toString() !== boardId);
				await user.save();
			}
		}

		// Remove from board members
		board.members.splice(memberIndex, 1);

		// Add activity
		board.activity.unshift({
			user: requesterId,
			name: requester.name,
			action: `removed member '${memberToRemove.name}' from this board`,
			color: requester.color,
		});

		await board.save();
		return callback(false, board.members);
	} catch (error) {
		return callback({ errMessage: error.message });
	}
};

const getAllAdmin = async (callback) => {
	try {
		const boards = await boardModel.find({});
		// Delete unneccesary objects
		boards.forEach((board) => {
			board.activity = undefined;
			board.lists = undefined;
		});
		return callback(false, boards);
	} catch (error) {
		return callback({ msg: 'Something went wrong', details: error.message });
	}
};

module.exports = {
	create,
	getAll,
	getById,
	getActivityById,
	updateBoardTitle,
	updateBoardDescription,
	updateBackground,
	addMember,
	acceptInvitation,
	rejectInvitation,
	getInvitations,
	removeMember,
	getAllAdmin,
};
