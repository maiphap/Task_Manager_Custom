const express = require('express');
const boardController = require('../Controllers/boardController');
const auth = require('../Middlewares/auth');
const { isAdmin } = require("../Middlewares/roleAuth");
const route = express.Router();

route.post('/:boardId/add-member', boardController.addMember);
route.put('/:boardId/update-background', boardController.updateBackground);
route.put('/:boardId/update-board-description', boardController.updateBoardDescription);
route.put('/:boardId/update-board-title', boardController.updateBoardTitle);
route.post('/create', boardController.create);
route.get('/invitations', auth.verifyToken, boardController.getInvitations);
route.patch('/:boardId/accept-invite', auth.verifyToken, boardController.acceptInvitation);
route.patch('/:boardId/reject-invite', auth.verifyToken, boardController.rejectInvitation);
route.delete('/:boardId/member/:userId', auth.verifyToken, boardController.removeMember);
route.get('/admin/all-boards', auth.verifyToken, isAdmin, boardController.getAllAdmin);
route.get('/:id', boardController.getById);
route.get('/:id/activity', boardController.getActivityById);
route.get('/', boardController.getAll);

module.exports = route;
