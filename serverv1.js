// load the express package and creates the application
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/db');

// send index.html file to the user for the home page
app.get('/', function(req, res) {
res.sendFile(path.join(__dirname + '/index.html'));
});

// creates the routes for the admin section
var adminRouter = express.Router()

// route middleware on every request
// middleware needs to be placed before a route
adminRouter.use(function(req, res, next){

   // log each request to the console
	console.log(req.method, req.url);

	// continue to the route
	next();
});

app.route('/login')

	.get(function(req, res) {
		res.send('login form');
	})

	.post(function(req, res) {
		console.log('processing');
		res.send('processing login form');
	});

// middleware validation of :name
adminRouter.param('name', function(req, res, next, name){

	// validation on name
	console.log('validation of name: ' + name);

	// once validation done save item in req
	req.name = name;

	next();
});

// route to admin
adminRouter.get('/', function(req, res) {
	res.send('The zer0 dashboard.')
});

// route to admin/users
adminRouter.get('/users', function(req, res) {
	res.send('I show all the users.')
});

// route to admin/posts
adminRouter.get('/posts', function(req, res) {
	res.send('The zer0 posts.')
});

// route with parameters (http://localhost:1337/admin/users/:name)
adminRouter.get('/users/:name', function(req, res) {
	res.send('Welcome ' + req.name + ' this is zer0!');
});

// initiates the routes for the application
app.use('/admin', adminRouter);

// start server
app.listen(8888);
console.log('zer0 is running.');
