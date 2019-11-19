var express =require("express");
var router = express.Router();
var Campground= require("../models/campground");
var Comment= require("../models/comment");
var middleware= require("../middleware");



// New comment route
router.get("/campgrounds/:id/comments/new",middleware.isLoggedin, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash("error", "Something went wrong!");
			res.redirect("back")
		}else{
			res.render("comments/new.ejs", {campground: campground})
		}
	})
})
router.post("/campgrounds/:id/comments", middleware.isLoggedin, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash("error", "Something went wrong!");
			res.redirect("back")
		}else{
		Comment.create(req.body.comment, function(err, comment){
			if(err){
				req.flash("error", "Something went wrong!");
				res.redirect("back")
			}else{
				comment.author.id = req.user._id;
				comment.author.username= req.user.username;
				comment.save();
				campground.comments.push(comment);
				campground.save();
				res.redirect("/campgrounds/"+ campground.id)
			}
		
		})
			}
	
	})
})

router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.commentOwnership, function(req, res){
		Comment.findById(req.params.comment_id, function(err, comment){
			if(err){
				req.flash("error", "Something went wrong!");
				res.redirect("/campgrounds/"+ req.params.id)
			}else {
			res.render("comments/edit.ejs", {comment: comment, campground_id :req.params.id}) }	
		})
})

router.put("/campgrounds/:id/comments/:comment_id", middleware.commentOwnership, function(req, res){
		Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,  function(err, comment){
			if(err){
				req.flash("error", "Something went wrong!");
				res.redirect("/campgrounds")
			}
			res.redirect("/campgrounds/"+ req.params.id)
		})
})

router.delete("/campgrounds/:id/comments/:comment_id", middleware.commentOwnership, function(req, res){
		Comment.findByIdAndRemove(req.params.comment_id,  function(err, comment){
			if(err){
				req.flash("error", "Something went wrong!");
				res.redirect("/campgrounds")
			}
			res.redirect("/campgrounds/"+ req.params.id)
		})
})

module.exports = router;