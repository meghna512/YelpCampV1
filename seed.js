var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
	{
		name: "Annapurna Circuit Trek",
		image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg,
		
description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."} ,
	
	{ name: "Goecha La",
	image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg,
	description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
	
]
// var Comment= [
// 	{name:"This is a great place",
// 	author:"Homer"}
// ]


function seedDB(){
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		}else{
	console.log("removed campgrounds");
		
		data.forEach(function(seed){
			Campground.create(seed, function(err, campground){
				if(err){
					console.log(err);
				}else {
					console.log("created campround yo");
					Comment.create({ text: "blah blah blah!", author: "Homer"}, function(err, comment){
					if(err){
						console.log(err);
					}else {
						campground.comments.push(comment);
						campground.save();
						console.log("created new comment");
						}
					})
				}
				
			})
		})
		
	// })	
		}
	 })
}
module.exports = seedDB;

