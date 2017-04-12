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
			user = {
				email,
				first_name: firstName,
				last_name: lastName,
				password: hashedPassword,
				phone
			}
			return User.new(user);
		})
		.then(user => {
	//		// TODO: Verify user's number
	//		Call.sendVerification(phone, countryCode);
	// 		user = user;
	// 		// TODO: Update payload
			return auth.sign(user);
		})
		.then((token) => {
			res.status(200).json({
				user: user,
				token: token
			});	
		})
		.catch(err => {
			// console.log('Error: ', err);
			res.status(400).json({
				error: 'Email exists.'
			});
		});
});

router.post('/login', (req, res) => {
	res.status(200).send();
	// let { email, password } = req.body;	
	// let user;
	// User.find(email)
	// 	.then((user) => {
	// 		return auth.compare(password, user.password);
	// 	})
	// 	.then(verified => {
	// 		// TODO: Update user payload
	// 		return auth.sign(user);
	// 	})
	// 	.then(token => {
	// 		res.status(201).json({
	// 			user: user,
	// 			token: token
	// 		});
	// 	})
	// 	.catch(err => {
	// 		res.status(400).json({
	// 			error: err.message
	// 		});
	// 	});
});

router.post('/verify', (req, res) => {
	let verificationCode = req.body.verificationCode;
	// TODO: Get user phone and country code from DB
	Call.verify(phone, countryCode, verificationCode)
		.then(response => {
			res.status(201).json({
				message: 'Phone number has been successfully verified.'
			})
		})
		.catch(err => {
			res.status(400).json({
				error: err
			})
		})
});

module.exports = router;
