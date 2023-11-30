const express = require("express");
const { resisterUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserdetails, updatePassword, updateProfile, getAllusers, getUserdetailstoken, deleteuser } = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");


const router = express.Router();

router.route("/register").post(resisterUser);
router.route("/login").post(loginUser);
router.route("/details").get(isAuthenticatedUser, getUserdetails);
router.route("/details/:token").get(getUserdetailstoken);
router.route("/all").get(getAllusers);
router.route("/update").put(isAuthenticatedUser, updateProfile);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/delete").delete(isAuthenticatedUser, deleteuser);
router.route("/logout").post(logoutUser);


module.exports = router;