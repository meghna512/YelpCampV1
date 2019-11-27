require("dotenv").config();
var express =require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var middleware = require("../middleware");
var nodemailer= require("nodemailer");
var async= require("async");
var crypto= require("crypto");


router.get("/", function(req, res){
	res.render("landing.ejs");
})

//Show sign up form
router.get("/register", function(req, res){
	res.render("register.ejs", {page: 'register'})
})


router.get("/about", function(req, res){
	res.render("about.ejs", {page: 'about'});
})




// router.post("/register", function(req, res){
// 	User.register(new User({username: req.body.username }), req.body.password, req.body.email, function(err, user){
// 		if(err){
// 			req.flash("error", err.message);
// 			return res.redirect("/register");
// 		}
		
// 		passport.authenticate("local")(req, res, function(){
// 			req.flash("success", "Welcome to Yelpcamp "+ user.username+"! Nice to meet you!");
// 			res.redirect("/campgrounds");
// 		})
// 	})
// })


router.post("/register", function(req, res){
	 var newUser = new User({
        username: req.body.username,
        // firstName: req.body.firstName,
        // lastName: req.body.lastName,
        email: req.body.email
        // avatar: req.body.avatar
      })
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to Yelpcamp "+ user.username+"! Nice to meet you!");
			res.redirect("/campgrounds");
		})
	})
})

//show login form
router.get("/login", function(req, res){
	res.render("login.ejs", {page:'login'});
})

router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login",
	failureFlash: true,
	successFlash: 'Welcome back!'
}), function(req, res){
	
})
router.get("/logout", function(req ,res){
	req.logout();
	req.flash("success","Logged you out!");
	res.redirect("/campgrounds");
})

router.get("/forgot", function(req, res){
	res.render("forgot.ejs");
})
router.post("/forgot", function(req, res){
	async.waterfall([
		function(done){
			crypto.randomBytes(20, function(err, buf){
				var token= buf.toString('hex');
				done(err, token);
			});
		},
		function(token, done){
			User.findOne({email: req.body.email}, function(err, user){
				if(!user){
					req.flash("error", "No account with that email address exists.");
					return res.redirect("/forgot");
					}
				user.resetPasswordToken= token;
				user.resetPasswordExpires= Date.now() + 3600000;
				user.save(function(err){
					done(err, token, user);
				})
			})
		},
		function(token, user, done){
			var smtpTransport = nodemailer.createTransport({
				service: "Gmail",
				auth: {
					user: "kanaujiameghna512@gmail.com",
					pass: process.env.GMAILPW
				}
			});
			var mailOptions = {
				to: user.email,
				from: "kanaujiameghna512@gmail.com",
				subject: "Reset Password link for YelpCamp",
				text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
				
			};
			smtpTransport.sendMail(mailOptions, function(err){
				req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
				done(err, "done");
			})
		}
		], function(err){
		
		res.redirect("/forgot");
	
	})
})

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset.ejs', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
	  function(user, done){
		  var smtpTransport = nodemailer.createTransport({
			  service: "Gmail",
			  auth: {
					user: "kanaujiameghna512@gmail.com",
					pass: process.env.GMAILPW
				}
		  });
		  var mailOptions={
			 	to: user.email,
				from: "kanaujiameghna512@gmail.com",
				subject: "Password has been changed for YelpCamp",
			    text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'

		  }
		  smtpTransport.sendMail(mailOptions, function(err){
			  req.flash('success', 'Your password has been changed successfully.');
        		done(err);
		  })
	  }
	  ], function(err){
	  console.log(err);
	  res.redirect("/campgrounds");
  
				  })
})
module.exports = router;