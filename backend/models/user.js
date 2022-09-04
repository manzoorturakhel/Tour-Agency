const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is must"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "email must is required"],
    lowercase: true,
    validate: [validator.isEmail, "provide valid email"],
  },
  photo: {
    type: String,
    //required:[true,'photo is required']
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "confirm password is required"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "confirm password must match password",
    },
  },
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
//document middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

// query middleware
userSchema.pre(/^find/, function (next) {
  console.log("pre find is called");
  this.where({ active: { $ne: false } });
  next();
});
// instances of class
userSchema.methods.checkPassword = async function (
  enteredPassword,
  actualPassword
) {
  return await bcrypt.compare(enteredPassword, actualPassword);
};

// password change method

userSchema.methods.isPasswordChanged = function (JWTTimestamp) {
  // checking if the passwordChangedAt exists intially it doesnt exists because we dont specify this property.
  // if it exists then we check if the password has been changed before the timeStamp or it was changed after the JWT timestamp
  if (this.passwordChangedAt) {
    const timeStamp = this.passwordChangedAt.getTime() / 1000;

    return timeStamp > JWTTimestamp; // return true only if the jwtTimestamp is greater then passwordchangedAt times because the token was issued before the password was changed
    // if the password is changed before the timeStamped then there is no issue.
  }

  //by default its false because everyone hasn't changed his/her password
  return false;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
