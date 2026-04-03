const express = require("express");
const userController = require("../Controllers/userController");
const router = express.Router();
const auth = require("../Middlewares/auth");
const { isAdmin } = require("../Middlewares/roleAuth");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/get-user", auth.verifyToken, userController.getUser);
router.post("/get-user-with-email", auth.verifyToken, userController.getUserWithMail);
router.post("/google-login", userController.googleLogin);
router.patch("/update-profile", auth.verifyToken, userController.updateProfile);

// Admin Routes
router.get("/admin/users", auth.verifyToken, isAdmin, userController.getAllUsers);
router.delete("/admin/user/:id", auth.verifyToken, isAdmin, userController.deleteUser);
router.get("/admin/stats", auth.verifyToken, isAdmin, userController.getAdminStats);

module.exports = router;
