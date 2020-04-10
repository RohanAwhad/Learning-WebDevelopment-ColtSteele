var express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    mongoose = require('mongoose'),
    User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/auth_demo_app', {useNewUrlParser: true, useUnifiedTopology: true});

var app = express();
app.set('view engine', 'ejs');
app.use(require('express-session')({
    secret: 'Testing',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==============================
//		Routes
//==============================

app.get('/', function(req, res){
    res.render('home');
});

app.get('/secret', isLoggedIn, function(req, res){
    res.render('secret');
});

app.get('/register', function(req, res){
    res.render('register')
});

app.post('/register', function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
	if(err){
	    console.log(err);
	    return res.render('register');
	} else{
	    console.log(user);
	    passport.authenticate('local')(req, res, function(){
		return res.redirect('/secret');
	    })
	}
    });
});

app.get('/login', function(req, res){
   res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}), function(req, res){});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
	return next();
    }
    res.redirect('/login')
}

app.listen(3000, function(){
    console.log('Server started...');
    console.log('http://localhost:3000/');
})


