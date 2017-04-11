const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const dev = require('./dev.js');

const requestHandler = require('./requestHandler.js');
const callingHandler = require('./calling/callingHandler.js');

const app = express();

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  dev.webpack(app);
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.resolve(__dirname, '../client/public')));

app.use('/calls', express.static(path.join(__dirname, '/calling/files')))
app.use('/api/calling', callingHandler);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});

module.exports = server;
