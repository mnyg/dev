 	// server.js

// CALL PACKAGES
var express = require('express'); // call express
var app = express(); // define app using express
var bodyParser = require('body-parser'); // call body-parser
var morgan = require('morgan'); // used to see requests
var mongoose = require('mongoose'); // for the database
var port = process.env.PORT || 8888; // sets the port for app
var User = require('./app/models/user'); // Calls on user.js in models folder
var apiRouter = express.Router(); // instance of express router


// Uses mongoose to connect with localMongoDB
mongoose.connect('mongodb://localhost/db');

// APP CONFIGURATION
// use bodyparser to catch info from post requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

next();
});

// logs request to console
app.use(morgan('dev'));

// ROUTES FOR API
// route for homepage
app.get('/', function(req, res) {
	res.send('Welcome to ZER0');
});

app.all('/secret', function (req, res, next) {
  console.log('Accessing the secret section ...');
  next(); // pass control to the next handler
});

// show json message at /api
apiRouter.get('/', function(req, res) {
	res.json({ message: 'Welcome ZER0 is waiting.'});
});


apiRouter.route('/users')

	// Create a user (localhost/api/users)
	.post(function(req, res) {
		// create a new instance of user model
		var user = new User();

		// sets the user information
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;

		// save the user information and check errors
		user.save(function(err) {
			if(err) {
				// if there is a duplicate post error
				if(err.code == 11000) 
					return res.json({ success: false, message: 'Username already exists. '});
				else	
					return res.send(err);
			}
			// Post json message
			res.json({message: 'User created'});
		});
	})
	// Get all users
	.get(function(req, res) {
		User.find(function(err, users) {
			if(err) res.send(err);
			// return users requested
			res.json(users);
		});
	})
// CRUD Commands
// Route for specific user
apiRouter.route('/users/:user_id')
	
	.get(function(req, res) 	{
		
		User.findById(req.params.user_id, function(err, user) {
			if (err) res.send(err);

			// return user with specific id
			res.json(user);
		});
	})

	// update user with 
	.put(function(req, res) {

		// use usermodel to find requested user
		User.findById(req.params.user_id, function(err, user) {
			if (err) res.send(err);

			// update with this information if info is new
			if (req.body.name) user.name = req.body.name;
			if (req.body.username) user.username = req.body.username;
			if (req.body.password) user.password = req.body.password;

			// save user
			user.save(function(err) {
				if (err) res.send(err);

				// return message
				res.json({ message: 'Updated'});
			});
		});
	})

	// delete user with requested id
	.delete(function(req, res) {
		User.remove({
			_id: req.params.user_id

		}, function(err, user) {
				if (err) return res.send(err);

				// return message
				res.json({ message: 'Deleted' });
		});
	});


// REGISTER ROUTES
// routes prefixed to /api
app.use('/api', apiRouter);

// START SERVER
app.listen(port);
console.log(port + ' is the number');
