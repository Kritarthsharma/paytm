const mongoose = require("mongoose");
const argon2 = require("argon2");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please tell us your user name"],
    minlength: 6,
    unique: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: [true, "Please tell us your first name"],
    minlength: 1,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Please tell us your last name"],
    minlength: 1,
    trim: true,
  },
  passWord: {
    type: String,
    required: [true, "Please provide a password"],
    trim: true,
    minlength: 6,
    select: false,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("passWord")) return next();

  this.passWord = await argon2.hash(this.passWord);
  next();
});

UserSchema.methods.verifyPassword = async (userPassword, candidatePassword) =>
  await argon2.verify(userPassword, candidatePassword);

const User = mongoose.model("User", UserSchema);

module.exports = User;
