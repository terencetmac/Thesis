const router = require('express').Router();
const Call = require('./config.js');
const xml = require('xml');

router.post('/call', (req, res) => {
	// Call.call();
	res.status(201).send();
});

router.post('/called', (req, res) => {
	res.status(200).send(xml({a: 'ok'}));
})

module.exports = router;