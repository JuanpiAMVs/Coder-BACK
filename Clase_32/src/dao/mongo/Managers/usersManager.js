import userModel from "../models/user.model.js";

export default class UsersManager {
  getUsers = (params) => {
    return userModel.find(params).lean();
  };

  getUserBy = (params) => {
    return userModel.findOne(params).lean();
  };

  createUser = (user) => {
    return userModel.create(user);
  };

  updateUser = (uid, user) => {
    return userModel.findByIdAndUpdate(uid, { $set: user });
  };

  deleteUser = (uid) => {
    return userModel.findByIdAndDelete(uid);
  };
}