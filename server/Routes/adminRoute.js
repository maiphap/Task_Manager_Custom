const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const { isAdmin } = require('../Middlewares/roleAuth');

// --- User Management ---
router.get('/users', isAdmin, adminController.getAllUsers);
router.patch('/users/:userId/ban', isAdmin, adminController.toggleBanUser);
router.patch('/users/:userId/role', isAdmin, adminController.updateUserRole);

// --- Board Moderation ---
router.get('/boards', isAdmin, adminController.getAllBoards);
router.delete('/boards/:boardId', isAdmin, adminController.toggleDeleteBoard);
router.patch('/boards/:boardId/restore', isAdmin, adminController.toggleDeleteBoard); // Reusing the same function as it's a toggle

// --- Analytics ---
router.get('/stats', isAdmin, adminController.getStats);

// --- Settings & Logs ---
router.get('/logs', isAdmin, adminController.getAuditLogs);
router.post('/settings/notification', isAdmin, adminController.updateSystemNotification);

// Publicly available (but needs to be called by app)
router.get('/settings/notification', adminController.getSystemNotification);

module.exports = router;
