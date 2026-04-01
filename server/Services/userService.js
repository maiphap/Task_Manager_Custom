const userModel = require("../Models/userModel");
const { createRandomHexColor } = require("./helperMethods");

const register = async (user, callback) => {
  const newUser = userModel({ ...user, color:createRandomHexColor()});
  await newUser
    .save()
    .then((result) => {
      return callback(false, { message: "User created successfuly!" });
    })
    .catch((err) => {
      return callback({ errMessage: "Email already in use!", details: err });
    });
};

const login = async (email, callback) => {
  try {
    let user = await userModel.findOne({ email });
    if (!user) return callback({ errMessage: "Your email/password is wrong!" });
    return callback(false, { ...user.toJSON() });
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};

const getUser = async (id, callback) => {
  try {
    let user = await userModel.findById(id);
    if (!user) return callback({ errMessage: "User not found!" });
    return callback(false, { ...user.toJSON() });
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};

const getUserWithMail = async (email, callback) => {
  try {
    let user = await userModel.findOne({ email });
    if (!user)
      return callback({
        errMessage: "There is no registered user with this e-mail.",
      });
    return callback(false, { ...user.toJSON() });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};

const createGoogleUser = async (user, callback) => {
  const newUser = userModel({ ...user, color: createRandomHexColor() });
  try {
    const savedUser = await newUser.save();
    return callback(false, { ...savedUser.toJSON() });
  } catch (err) {
    return callback({ errMessage: "Email already in use!", details: err });
  }
};

const getAllUsers = async (callback) => {
  try {
    let users = await userModel.find({});
    users.forEach(user => {
      user.password = undefined;
    });
    return callback(false, users);
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};

const deleteUserByAdmin = async (id, callback) => {
  try {
    const user = await userModel.findById(id);
    if (!user) return callback({ errMessage: "User not found!" });

    // Xóa user khỏi tất cả các boards mà họ tham gia
    const boardModel = require("../Models/boardModel");
    await boardModel.updateMany(
      { "members.user": id },
      { $pull: { members: { user: id } } }
    );

    await user.remove();
    return callback(false, { message: "User deleted successfully!" });
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};

const getAdminStats = async (callback) => {
  try {
    const boardModel = require("../Models/boardModel");
    const cardModel = require("../Models/cardModel");

    const userCount = await userModel.countDocuments();
    const boardCount = await boardModel.countDocuments();
    const cardCount = await cardModel.countDocuments();

    return callback(false, {
      users: userCount,
      boards: boardCount,
      cards: cardCount,
    });
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};

module.exports = {
  register,
  login,
  getUser,
  getUserWithMail,
  createGoogleUser,
  getAllUsers,
  deleteUserByAdmin,
  getAdminStats,
};
