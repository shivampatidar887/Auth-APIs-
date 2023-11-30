const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please Enter Your name"],
        maxLength: [25, "Name can not exceed 25 characters"],
        minLength: [4, "Name Should have more then 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please enter you email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a Valid Email"],
    },
    username: {
        type: String,
        trim: true,
        required: [true, "Please enter a valid username"],
        unique: true,
        maxLength: [25, "username can not exceed 25 characters"],
        minLength: [4, "username Should have more then 4 characters"],
    },
    bio: {
        type: String,
        trim: true,
        maxLength: [200, "bio should not contain more than 200 characters"],
    },
    age: {
        type: Number,
        min: 0,
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        maxLength: [25, "Password can not exceed 25 characters"],
        minLength: [4, "Password Should have morre then 4 characters"],
        select: false,         // anyone should cannot get password by find method
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {     // not hash already hashed password at the time of edit profile
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {   // make token from secret key and user id
        expiresIn: process.env.JWT_EXPIRE
    })
};

// compare password
userSchema.methods.comparePassword = async function (enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password);
};

// genarating resetpasswordtoken
userSchema.methods.getresetPasswordToken = function () {

    //Genarating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

module.exports = mongoose.model("User", userSchema);