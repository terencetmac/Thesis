const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const dev = require('./dev.js');

const requestHandler = require('./requestHandler.js');
const callingHandler = require('./calling/callingHandler.js');
const authHandler = require('./auth/authHandler.js');
const auth = require('./auth/utils.js');
const Call = require('./calling/config.js');

const app = express();

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  dev.webpack(app);
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.resolve(__dirname, '../client/public')));

// TEMP: Protected route for Testing
app.get('/protected', auth.authMiddleware, (req, res) => {
	res.status(200).send();
});

app.get('/testing', (req, res) => {
	// Call.sendVerification();
})
app.get('/testingverify', (req, res) => {
	// Call.verify();
})

app.use('/calls', express.static(path.join(__dirname, '/calling/files')))
app.use('/api/calling', callingHandler);

app.use('/api/auth', authHandler);

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
	const server = app.listen(port, () => {
	  console.log(`listening on port ${port}...`);
	});
}

module.exports = { app };
