const Users = require("../models/User");
const { sendTokenResponse } = require("../middleware/utils");
// const sendMail = require('./sendMail')

const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const client = new OAuth2(process.env.GOOGLE_CLIENT_ID);

const { CLIENT_URL } = process.env;

//get logged in user
exports.getUser = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//register user locally
exports.registration = async () => {};

//activate user account
exports.activateAccount = async () => {};

//login user locally
exports.login = async () => {};

//forgot passowrd
exports.forgotPassword = async () => {};

//reset password
exports.resetPassword = async () => {};

//google login
exports.googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;

    const verify = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email_verified, email, name, picture } = verify.payload;
    const password = email + process.env.GOOGLE_CLIENT_SECRET;
    if (!email_verified) {
      return res.status(400).json({ msg: "Email verification failed." });
    }

    const user = await Users.findOne({ email });

    if (user) {
      const validate = await user.matchPassword(password);
      if (!validate) {
        return res.status(400).json({ msg: "Password is incorrect." });
      }
      sendTokenResponse(user, 200, res);
    } else {
      const newUser = new Users({
        name,
        email,
        password,
        avatar: picture,
      });
      await newUser.save();
      sendTokenResponse(user, 200, res);
    }
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
