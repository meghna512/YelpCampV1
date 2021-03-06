require("dotenv").config();
var express=	 	require("express"),
	app = 			express(),
	bodyParser = 	require("body-parser"),
	mongoose = 		require("mongoose"),
	Campground = 	require("./models/campground"),
	Comment=		require("./models/comment"),
	User=			require("./models/user"),
	methodOverride= require("method-override"),
	flash=			require("connect-flash"),
	passport= 		require("passport"),
	LocalStrategy=	require("passport-local"),
	passportLocalMongoose= require("passport-local-mongoose"),
	seedDB = 		require("./seed.js");

var campgroundRoutes 	= require("./routes/campgrounds"),
	commentRoutes 		= require("./routes/comments"),
	indexRoutes 		= require("./routes/index");


//mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false, useCreateIndex: true});



mongoose.connect(process.env.DATABASEURL,
				{ useNewUrlParser: true,
				useCreateIndex: true,
				 useUnifiedTopology: true,
				 useCreateIndex: true
				}).then( () =>{ console.log('connected to DB');
	
}).catch(err =>{
	console.log('ERROR', err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method")); //tells express to look for _method


app.use(flash());
app.use(require("express-session")({
		secret: "There is No secret , hahaha!",
		resave: false,
		saveUninitialized: false
		}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());
app.use(function(req , res, next){
	res.locals.currentUser = req.user;
	res.locals.error= req.flash("error");
	res.locals.success= req.flash("success");
	next();
})
app.locals.moment= require("moment");
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);


//seedDB();


app.listen(process.env.PORT || 3000, function(){
	console.log("yelpcamp server has started");
})