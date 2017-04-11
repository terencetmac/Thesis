const router = require('express').Router();
const auth = require('./utils.js');

router.post('/signup', (req, res) => {
	// let { email, phone, firstName, lastName, password } = req.body.user;
	// let user;
	// auth.hash(password)
	// 	.then(hashedPassword => {
	// 		user = {
	// 			email,
	// 			phone,
	// 			first_name: firstName,
	// 			last_name: lastName,
	// 			password: hashedPassword
	// 		}
	// 		// return User.create(user)
	// 	})
	// 	.then(user => {
	// 		user = user;
	// 		// TODO: Update payload
	// 		return auth.sign(userPayload);
	// 	})
	// 	.then((token) => {
	// 		res.status(200).json({
	// 			user: user,
	// 			token: token
	// 		});	
	// 	})
	// 	.catch(err => {
	// 		res.status(400).send(err.message);
	// 	});
});

router.post('/login', (req, res) => {
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

module.exports = router;
