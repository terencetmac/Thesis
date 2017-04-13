const router = require('express').Router();
const auth = require('./utils.js');
const Call = require('../calling/config.js');
const User = require('../models/users.js');

router.post('/signup', (req, res) => {
	// TODO: Add server validation
	
	let { email, firstName, lastName, password, phone } = req.body;
	let user;

	auth.hash(password)
		.then(hashedPassword => {
			return User.new({
				email,
				first_name: firstName,
				last_name: lastName,
				password: hashedPassword,
				phone
			});
		})
		.then(userFromDb => {
	//		// TODO: Verify user's number
			Call.sendVerification(userFromDb.phone);
			user = userFromDb;
			return auth.sign(user);
		})
		.then(token => {
			res.status(200).json({
				user: user,
				token: token
			});	
		})
		.catch(err => {
			// console.error('Error: ', err);
			res.status(400).json({
				error: 'Email exists.'
			});
		});
});

router.post('/login', (req, res) => {
	let { email, password } = req.body;	
	let user;
	User.findByEmail(email)
		.then((userFromDb) => {
			user = userFromDb;
			return auth.compare(password, user.password);
		})
		.then(verified => {
			if (verified) {
				return auth.sign(user);
			} else {
				throw new Error('Invalid Email/Password combination');
			}
		})
		.then(token => {
			res.status(200).json({
				user: user,
				token: token
			});
		})
		.catch(err => {
			// console.error('Error: ', err)
			res.status(401).json({
				error: err
			});
		});
});

router.use('/verify', auth.authMiddleware);
router.post('/verify', (req, res) => {
	let verificationCode = req.body.verificationCode;
	let { user_id, phone } = req.user // from middleware
	Call.verify(phone, 1, verificationCode)
		.then(response => {
			if (response) {
				User.verifyPhone(user_id, phone);
				res.status(201).json({
					message: 'Phone number has been successfully verified.'
				});
			}
		})
		.catch(err => {
			res.status(400).json({
				error: err
			})
		})
});

module.exports = router;
