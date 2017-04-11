const router = require('express').Router();
const Call = require('./config.js');
const xml = require('xml');

router.post('/call', (req, res) => {
	// TODO: Initiate call from Call.call(userId);
	// Call.call();
	res.status(201).send();
});

router.post('/called', (req, res) => {
	res.set({
		'Content-Type': 'text/xml'
	});
	res.status(200).send('<Response />');
});

module.exports = router;