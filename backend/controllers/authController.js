const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const AppErr = require("../utils/appErr");

const jwtFn = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};
const createAndSendToken = (user, statusCode, res) => {
  const token = jwtFn(user._id);

  return res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
const filteredBody = (bodyObj, ...allowedThings) => {
  const newBody = {};

  for (i in bodyObj) {
    if (allowedThings.includes(i)) {
      newBody[i] = bodyObj[i];
    }
  }
  return newBody;
};

exports.signUp = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  createAndSendToken(user, 201, res);
  // const token = jwtFn(user._id);

  // res.status(201).json({
  //   status: "success",
  //   token,
  //   data: {
  //     user,
  //   },
  // });
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppErr("password and email are required to enter", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  // console.log("user id", user.password);
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppErr("password or email is wrong!!", 401));
  }
  //const token = jwtFn(user._id);
  //console.log("token:", token);
  createAndSendToken(user, 200, res);

  // res.status(200).json({
  //   status: "success",
  //   token: token,
  //   data: {
  //     user,
  //   },
  // });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  console.log("req", req.headers);
  // step#1 getting the token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //console.log(req.headers.authorization);
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppErr("you are not authorized to access this path", 401));
  }
  //step#2 verifying the token
  const verifiedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  console.log(verifiedToken.id);

  // step#3 check whether the user still exists or not
  const doesUserExists = await User.findById(verifiedToken.id);

  if (!doesUserExists) {
    return next(
      new AppErr(
        "user is not available please try to login using another id",
        401
      )
    );
  }
  // step#4 checking whether the user has changed password after the token was issued to do that we need an instance method which is availabe only through document object

  if (doesUserExists.isPasswordChanged()) {
    return next(
      new AppErr(
        "the user has changed his password please login again using correct password",
        401
      )
    );
  }
  // storing the doesUserExists document into req.user
  req.user = doesUserExists;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppErr(
          "you're not allowed to delete routes because your either a user or guide",
          403
        )
      );
    }
    console.log("after else");
    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findOne({ email: req.user.email }).select(
    "+password"
  );
  console.log("user before update:", user);

  const isPasswordCorrect = await user.checkPassword(
    currentPassword,
    user.password
  );
  if (!isPasswordCorrect) {
    return next(
      new AppErr(
        "your entered password doesnt matches with the original password,please try again",
        401
      )
    );
  }
  user.password = newPassword;
  user.confirmPassword = confirmPassword;
  const updatedUser = await user.save();
  // const updatedUser = await User.updateOne( this wont work because we have set the validation and instance methods on save
  //   {},
  //   { $set: { password: newPassword } },
  //   { runValidators: true }
  // );

  console.log("user after update:", updatedUser);
  createAndSendToken(user, 200, res);
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  // if either password of confirmPassword exists we will return an error

  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppErr(
        "updating password is not allowed here because we have a seperate path for password changing",
        400
      )
    );
  }

  const filtered = filteredBody(req.body, "name", "email");

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filtered, {
    runValidators: true,
    new: true,
  });
  //console.log(updatedUser);
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  console.log("inside delete me");
  await User.findByIdAndUpdate(req.user.id, { active: false });

  return res.status(204).json({
    status: "success",
    data: {
      user: null,
    },
  });
});
