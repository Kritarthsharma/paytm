const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const Account = require("../models/accountModel");

exports.signUp = async (req, res) => {
  const userObj = {
    userName: req.body.userName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    passWord: req.body.passWord,
  };

  try {
    const user = await User.create(userObj);
    await Account.create({
      userId: user.id,
      balance: 1 + Math.random() * 10000,
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({
      message: "User created successfully",
      token,
    });
  } catch (error) {
    if (error.code === 11000)
      return res
        .status(409)
        .send(
          "User already exists with this email. Please try with a different one!"
        );
    else
      return res
        .status(500)
        .send({ code: error.code, message: "Internal Servor error" });
  }
};
exports.signIn = async (req, res) => {
  const { userName, passWord } = req.body;

  try {
    const user = await User.findOne({ userName }).select("+passWord");
    if (!user || !(await user.verifyPassword(user.passWord, passWord)))
      return res.status(401).send("User does not exist / Invalid password");
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({
      token,
    });
  } catch (error) {
    res
      .status(500)
      .send({ code: error.code, message: "Error while logging in" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(401).send("Can't update user does not exist");
    user.passWord = req.body.passWord;
    await user.save();
    res.json({
      message: "Updated successfully",
      user,
    });
  } catch (error) {
    if (error.name === "ValidationError")
      return res
        .status(411)
        .send(
          "Error while updating user. Please check your details and try again!"
        );
    else return res.status(500).send({ message: "Internal Servor error" });
  }
};

exports.searchUser = async (req, res) => {
  const filter = req.query.filter || "";
  try {
    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
          },
        },
        {
          lastName: {
            $regex: filter,
          },
        },
      ],
    });
    if (users.length === 0) return res.status(200).send("No users found!");
    return res.json({
      users: users.map((user) => ({
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user.id,
      })),
    });
  } catch (error) {
    return res.status(500).send({ message: "Internal Servor error" });
  }
};
