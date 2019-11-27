var express =require("express");
var router = express.Router();
var Campground= require("../models/campground");
var middleware =require("../middleware");


router.get("/campgrounds", function(req,res){
	// search
	if(req.query.search){
		var noMatch= null;
		var search= new RegExp(escapeRegex(req.query.search), 'gi');
		Campground.find({"name":search}, function(err, allCampground){
		if(err){
			res.redirect("/campgrounds")
		}else{
			if(allCampground.length < 1){
				noMatch= "No such campground found, please try again!";		
			}
			res.render("campgrounds/index.ejs", {campgrounds: allCampground, currentUser: req.user, noMatch:noMatch, page:'campgrounds'});
		}
	})
	} else{
	// })
		
		
	Campground.find({}, function(err, allCampground){
		if(err){
			req.flash("error", "Something went wrong!");
			res.redirect("back")
		}else{
			res.render("campgrounds/index.ejs", {campgrounds: allCampground, currentUser: req.user, noMatch:noMatch, page:'campgrounds'});
		}
	})
	}
	
});

router.get("/campgrounds/new", middleware.isLoggedin, function(req, res){
	res.render("campgrounds/new.ejs");
})

router.post("/campgrounds", middleware.isLoggedin, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc= req.body.description;
	var price= req.body.price;
	var location= req.body.location;
	var bookingwindow= req.body.bookingwindow;
		
	var author= {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name:name, image: image, price: price, description: desc, location: location, bookingwindow:bookingwindow,  author: author};
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			req.flash("error", "Something went wrong!");
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	})
	
})

// show campground
router.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments likes").exec(function(err, foundCampground){
		if(err){
			req.flash("error", "Something went wrong!");
			res.redirect("/campgrounds");
		}else{
			res.render("campgrounds/show.ejs", {campground: foundCampground});
		}
	})
})


// like post route
router.post("/campgrounds/:id/like", middleware.isLoggedin, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
            return res.redirect("/campgrounds");
			}
			var foundUserLike = campground.likes.some(function (like) {
            return like.equals(req.user._id);
       	 });
		if(foundUserLike){
			campground.likes.pull(req.user._id); //pulls out the user's id from likes array
		} else{
			campground.likes.push(req.user); //look later
		}
		campground.save();
		return res.redirect("/campgrounds/" + campground._id);
	})
});


router.get("/campgrounds/:id/edit", middleware.campgroundOwnership , function(req, res){
	 Campground.findById(req.params.id, function(err, campground){
		 if(err){
			 req.flash("error", "Something went wrong!");
			 res.redirect("back")
		 } else{
			  res.render("campgrounds/edit.ejs", {campground:campground })
		 }	
		 })
})


router.put("/campgrounds/:id", middleware.campgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			req.flash("error", "Something went wrong!");
			res.redirect("/campgrounds/"+ req.params.id);
		}else{
			res.redirect("/campgrounds/"+ req.params.id);
		}
	})
	
})
// Destroy campground route
router.delete("/campgrounds/:id", middleware.campgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash("error", "Something went wrong!");
			res.redirect("/campgrounds")
		}else{
			res.redirect("/campgrounds")
		}
	})
})


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports = router;
	