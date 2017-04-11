const router = require('express').Router();
const Call = require('./config.js');
const xml = require('xml');

router.post('/call', (req, res) => {
	// TODO: Initiate call from Call.call(userId);
	res.status(201).send();
});

router.post('/called', (req, res) => {
	// TODO: Update response to send back <Response /> and 
	// Content-Type: text/xml
	res.status(200).send(xml({a: 'ok'}));
});

module.exports = router;