var passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt        = require('bcryptjs');

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findOne(id).done(function (err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		// asynchronous verification, for effect...
		process.nextTick(function () {
			// Find the user by username or email.
			// If there is no user with the given username,
			// or the password is not correct,
			// set the user to `false` to indicate failure
			// and set a flash message.
			// Otherwise, return the authenticated `user`.
			User.findOne().where({
				or: [
					{ username: username },
					{ email: username }
				]
			}).done(function(err, user) {
				if (err) { return done(null, err); }
				if (!user) {
					var user = {};
					var re_email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					// If username is an email, save as mail, else as username.
					user[re_email.test(username)?'email':'username'] = username;
					return done(null, user, { message: 'Unknown user ' + username });
				}
				bcrypt.compare(password, user.password, function(err, res) {
					if (!res) return done(null, false, { message: 'Invalid Password'});
					return done(null, user, { message: 'Logged In Successfully'} );
				});
			});
		});
	}
));

module.exports = {
	providers: {
		'github': {},
		'facebook': {},
		'twitter': {}
	},
	express: {
		customMiddleware: function(app){
			console.log('Express midleware for passport');
			app.use(passport.initialize());
			app.use(passport.session());
			app.use(function(req,res,next){
				// Set the loggedUser in locals
				// to get it from the view
				res.locals.loggedUser = req.user;
				next();
			});
		}
	}
};
