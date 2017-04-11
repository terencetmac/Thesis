const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

/**
	Utils functions return Promises.
 */
module.exports = {
	hash: function(plainTextPassword) {
		return bcrypt.hash(plainTextPassword, saltRounds);
	},

	/**
		* Compares a user's plain text password with the hashed password
		* retrieved from the DB.
		* @return {Boolean} True if successful
	 */
	compare: function(plainTextPassword, hashedPassword) {
		return bcrypt.compare(plainTextPassword, hashedPassword);
	},

	sign: function(user) {
		// TODO: Update payload
		let payload = {
			email: user.email
		};

		let config = {
			algorithm: 'HS256',
			expiresIn: '2 days'
		};

		return new Promise((resolve, reject) => {
			jwt.sign(payload, process.env.JWT_SECRET, config, (err, token) => {
				if (err) {
					reject(err);
				} else {
					resolve(token);
				}
			});
		});
	},

	verify: function(token) {
		return new Promise((resolve, reject) => {
			jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
				if (err) {
					reject(err);
				} else {
					resolve(decoded);
				}
			});
		});
	},

	authMiddleware: function(req, res, next) {
		let token = req.headers['authorization'];

		if (!token) {
			return next();
		}

		token = token.replace('Bearer ', '');

		module.exports.verify(token)
			.then(decoded => {
				// TODO: Set user object into req
				// req.user = user;
				next();
			})
			.catch(err => {
				// TODO: Create a proper error message
				return res.status(401).json({
					message: 'Please login.'
				});
			});
	}

	// TODO: Verify token on refresh

}
