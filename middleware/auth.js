const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const errorHandler = require("../utils/errorhandler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {

  token = req.cookies.token;
  if (!token) {
    return next(new errorHandler("Please login to access this resourcess", 401));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);       // we use user id for create token with secret key
  next();
});