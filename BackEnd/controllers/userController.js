const passport = require("passport");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const User = require("../models/User");

const { sendTokenResponse } = require("../middleware/utils");

const { sendEmail } = require("../middleware/email");

const {
  loginValidations,
  registerValidations,
  changePasswordValidation,
  resetPasswordValidation,
} = require("../middleware/validation");

//Email tester site
let transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "e4ce1728960690",
    pass: "8664c19d1f8ea9",
  },
});

class UserController {
    async getUser(req, res) {
        try {
          const user = await User.findById(req.user.id);
          if (!user) {
            return res.json({ msg: "user not found" });
          }
          res.json(user);
        } catch (error) {
          console.log(error);
        }
    }

    renderLoginView(req, res) {
      return res.render("login", { message: req.flash("loginMessage") });
    }
    
    renderRegisterView(req, res) {
      return res.render("register", { message: req.flash("signupMessage") }); 
    }

    render2factAuth(req, res) {
      return res.render("setup-2fa");
    } 

    registerWithPassport(req, res, next) {
      console.log(req.body);

      passport.authenticate(
        "register",
        function (err, user, info) {
          if (err) {
            req.flash("signupMessage", err);
          }
          const { error } = registerValidations(req.body);
          if (error) {
            req.flash("signupMessage", error.details[0].message);
            return res.redirect("/users/register");
            // return res.status(400).json(error.details[0].message);
          }
          if (info) {
            // res.status(401);
            req.flash("signupMessage", info.message);
            return res.redirect("/users/register");
            // return res.status(401).json(info.message);
          }
          if (user) {
            req.flash("loginMessage", "User created succesfully you can now login"),
              console.log(user);
            return res.redirect("/users/login");
            // return res.json(user);
          }
        }
      )(req, res, next);
    }

    loginWithPassport(req, res, next) {
      passport.authenticate(
        "login",
        function (err, user, info) {
          console.log(req.body);
          if (err) {
            return next(err)
          }
          const { error } = loginValidations(req.body);
          if (error) {
            req.flash("loginMessage", error.details[0].message);
            return res.redirect("/users/login");
          }
          if (info) {
            // res.status(401);
            req.flash("loginMessage", info.message);
          
            return res.redirect("/users/login");
          }
          req.logIn(user, function (err) {
            if (err) {
              return next(err);
            }
            // //Email confirmation
            const message = {
              from: "elonmusk@tesla.com", // Sender address
              to: req.body.email, // List of recipients
              subject: "Loggin test", // Subject line
              text: "You have logged in your account!", // Plain text body
            };
            transport.sendMail(message, function (err, info) {
              if (err) {
                console.log(err);
              } else {
                console.log(info);
              }
            });
            // return res.status(200).json({
            //   msg: "success",
            //   data: user,
            //   status: 200,
            // });
            // return sendTokenResponse(user, 200, res);
            return res.redirect("../dashboard");
          });
        }
      )(req, res, next);
    }

    renderChangePassView(req, res) {
      return res.render("passwordChange", {
        user: req.user,
        message: req.flash("changepassMessage"),
      });
    }
    

    async updatePassword(req, res) {
      const id = req.user._id;
      try {
        const user = await User.findById({ _id: id });
        if (!user) {
          req.flash("changepassMessage", "user not authorized");
    
          return res.status(403).json({ msg: "user not authorized" });
        }
        const newDetails = {
          newPassword: req.body.newPassword,
          currentPassword: req.body.currentPassword,
        };
        const { error } = changePasswordValidation(newDetails);
        if (error) {
          req.flash("changepassMessage", error.details[0].message);
          return res.redirect("/users/passwordChange");
          // return res.json(error.details[0].message);
        }
        const validate = await user.matchPassword(newDetails.currentPassword);
        console.log(validate);
        if (!validate) {
          req.flash("changepassMessage", "password does not match record");
          return res.redirect("/users/passwordChange");
          // return res.json({ msg: "password does not match record" });
        }
        user.password = req.body.newPassword;
        const newUser = await user.save();
        req.flash("dashboardMessage", "password changed successfully");
        return res.redirect("../dashboard");
        // return res.json(newUser);
      } catch (error) {
        res.status(500).json({ msg: "server error" });
        console.log(error);
      }
    }

    renderDeleteView(req, res) {
      return res.render("delete", {
        user: req.user,
        message: req.flash("forgotpassMessage"),
      });
    }

    async deleteUser(req, res) {
      const id = req.user._id;
      try {
        const user = await User.findById({ _id: id });
        if (!user) {
          req.flash("forgotpassMessage", "user not authorized");
          return res.status(403).json({ msg: "user not authorized" });
        }
        const newDetails = {
          email: req.body.email,
          password: req.body.password,
        };
    
        const validate = await user.matchPassword(newDetails.password);
        console.log(validate);
        if (!validate) {
          req.flash("forgotpassMessage", "password does not match record");
          return res.redirect("/users/delete");
          // return res.json({ msg: "password does not match record" });
        }
        user.remove({ _id: id }, function (err) {
          if (err) res.json(err);
          else req.flash("welcomeMessage", "user deleted successfully");
          return res.redirect("/users/login");
        });
    
        // return res.json(newUser);
      } catch (error) {
        res.status(500).json({ msg: "server error" });
        console.log(error);
      }
    }
    
    renderForgottenPassView(req, res) {
      return res.render("forgotPassword", {
        message: req.flash("forgotpassMessage"),
      });
    }

    async emailForgottenPass(req, res) {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        req.flash(
          "forgotpassMessage",
          "No user with email try again with a valid email"
        );
        // return res.status(400).json({ msg: "no user with that email" });
      }
    
      const resetToken = user.getResetPasswordToken();
      console.log(resetToken);
      console.log(user);
      await user.save({
        validateBeforeSave: false,
      });
      // await user.save();
    
      //create reset url
      const resetUrl = `${req.protocol}://${req.get(
        "host"
      )}/users/resetpassword/${resetToken}`;
      console.log(resetUrl);
      const message = `you are receiving this email cux you requsted for a forgot password: \n\n   ${resetUrl}`;
    
      try {
        await sendEmail({
          email: user.email,
          subject: "show link",
    
          message: message,
        });
        req.flash("forgotpassMessage", "Email sent successfully");
        return res.redirect("/users/forgotPassword");
    
        // res.status(200).send({ success: true, data: "email sent" });
      } catch (error) {
        console.log(error);
        (user.resetPasswordToken = undefined),
          (user.resetPasswordExpire = undefined);
        await user.save({ validateBeforeSave: false });
        req.flash("forgotpassMessage", "Retry again");
        return res.redirect("/users/forgotPassword");
        // return res.status(500).send("Email could not be sent");
      }
    }

    async renderResetPassView(req, res) {
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resetToken)
        .digest("hex");
      try {
        const user = await User.findOne({
          resetPasswordToken: resetPasswordToken,
        });
        res.render("resetPassword", {
          message: req.flash("resetPassMessage"),
          user: user,
          resetPasswordToken,
        });
      } catch (error) {
        req.flash("resetPassMessage", "'server error");
        console.log(error);
      }
    }

    async resetPasswordWithToken(req, res) {
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resettoken)
        .digest("hex");
      // const user = await User.findOne({
      //   resetPasswordToken,
      //   resetPasswordExpire: { $gt: Date.now() },
      const user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
      });
      // });
      if (!user) {
        req.flash("resetPassMessage", "token does not exist ");
        return res.redirect("/users/forgotPassword");
        // return res.status(400).send("invalid token");
      }
    
      const { error } = resetPasswordValidation(req.body);
      if (error) {
        req.flash("resetPassMessage", error.details[0].message);
        return res.redirect(`/users/resetpassword/${resetPasswordToken}`);
        // return res.status(400).json(error.details[0].message);
      }
      //set the new password
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
    
      await user.save();
      req.flash("dashboardMessage", "password resets succesfully");
      return res.redirect("../dashboard");
      // sendTokenResponse(user, 200, res);
    }

    logOut(req, res) {
      req.logout();
      req.flash("success_msg", "You are logged out");
      res.redirect("/users/login");
    }
    
}

module.exports = new UserController();