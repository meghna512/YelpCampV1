//all midddlewares
var Campground= require("../models/campground");
var Comment = require("../models/comment");

var midddlewareObj={};

midddlewareObj.campgroundOwnership= function(req, res, next){
	if(req.isAuthenticated()){
		   Campground.findById(req.params.id, function(err, campground){
					if(err){
						req.flash("error", "Something went wrong!");
						res.redirect("back")
					} else{
						if(campground.author.id.equals(req.user._id)){
							next();
						} else{ 
							req.flash("error", "You do not have permission to do that");
							res.redirect("back")
						}
					}							
		   })
	} else{
		req.flash("error", "You need to login to do that");
		res.redirect("back")
		}


}
midddlewareObj.commentOwnership= function(req, res, next){
	if(req.isAuthenticated()){
		   Comment.findById(req.params.comment_id, function(err, comment){
						if(err){
							req.flash("error", "Something went wrong!");
							res.redirect("back");
						}else{
							if(comment.author.id.equals(req.user._id)){
								next();
							} else{ req.flash("error", "You do not have permission to do that");
								   res.redirect("back");
							}
						}				
					 })
	} else{
	req.flash("error", "You need to login to do that");
		res.redirect("back");
		}
}

midddlewareObj.isLoggedin= function(req, res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to login first");
	res.redirect("/login")	
	}

module.exports= midddlewareObj;