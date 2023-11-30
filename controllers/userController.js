const User = require("../models/userModel");
const errorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const jwtDecode = require("jwt-decode");

// 1. API for User Registration/Login
exports.resisterUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, email, username, age, bio, password } = req.body;
        const user = await User.create({
            name, email, username, age, bio, password,
        });
        sendToken(user, 201, res);
    } catch (err) {
        next(err);
    }
});

// Login user 
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return next(new errorHandler("Please Enter username and Password", 400));
    }
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
        return next(new errorHandler("Invalid username and Password", 401));
    }
    const isPasswordmatched = await user.comparePassword(password);
    if (!isPasswordmatched) {
        return next(new errorHandler("Invalid username and Password", 401));
    }
    sendToken(user, 200, res);
})

//2. API to Get User Details

// get login user details
exports.getUserdetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    })
});

// get user details by token
exports.getUserdetailstoken = catchAsyncErrors(async (req, res, next) => {
    const decodedtoken = jwtDecode(req.params.token);
    const user = await User.findById(decodedtoken.id);
    res.status(200).json({
        success: true,
        user,
    })
});

// Get all users (admin)
exports.getAllusers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
    })
});

// 3. API to Update User Details

// update user Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        age: req.body.age,
        bio: req.body.bio,
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        message: "profile update successfully",
        user,
    })
});

// update user Passoword
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordmatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordmatched) {
        return next(new errorHandler("Old password is not correct", 400));
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new errorHandler("Passwords dose not matched ! enter carefully", 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
})

// Get reset Password token
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new errorHandler("User not Found", 404));
    }
    const resetToken = user.getresetPasswordToken();

    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = `Your password token is:- \n\n ${resetPasswordUrl} \n
    in case if you are not request for it, Please Ignore!`;
    try {
        await sendEmail({
            email: user.email,
            subject: "Vyld Password recovery",
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} Successfully!`,
        })
    } catch {

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

    }
});
// reset password with token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() }, });
    if (!user) {
        return next(new errorHandler("Reset Password token is invalid or has been expired", 404));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new errorHandler("Password does not match, Please rewrite carefully!", 404));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    //  sendToken(user,200,res);   // login user after change the password
    res.status(200).json({
        success: true,
        message: "Password Reset Successfully",
    })
});

//4. API to Delete User Account

//delete a user 
exports.deleteuser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
        return next(new errorHandler(`User dose not exist with this id`, 404));
    }
    console.log(user)
    const isPasswordmatched = await user.comparePassword(req.body.password);
    if (!isPasswordmatched) {
        return next(new errorHandler("password is not correct", 400));
    }

    await user.remove();
    res.status(200).json({
        success: true,
        message: `User ${req.user.id} deleted successfully`,
    })
});

// 5. Log out
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        succes: true,
        message: "Log out successfully",
    })
});





