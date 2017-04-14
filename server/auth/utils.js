const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

/**
	Utils functions return Promises.
 */
module.exports = {
	hash: (plainTextPassword) => {
		return bcrypt.hash(plainTextPassword, saltRounds);
	},

	/**
		* Compares a user's plain text password with the hashed password
		* retrieved from the DB.
		* @return {Boolean} True if successful
	 */
	compare: (plainTextPassword, hashedPassword) => {
		return bcrypt.compare(plainTextPassword, hashedPassword);
	},

	sign: (user) => {
		let payload = {
			user_id: user.user_id,
			email: user.email,
			first_name: user.first_name,
			last_name: user.last_name,
			phone: user.phone
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

	verify: (token) => {
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

	authMiddleware: (req, res, next) => {
		let token = req.headers['authorization'];
		if (!token) {
			return next();
		}

		token = token.replace('Bearer ', '');

		module.exports.verify(token)
			.then(decoded => {
				req.user = decoded;
				next();
			})
			.catch(err => {
				console.log(err);
				// TODO: Create a proper error message
				return res.status(401).json({
					message: 'Please login.'
				});
			});
	}

	// TODO: Verify token on refresh

}
