const twilio = require('twilio');
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio.RestClient(accountSid, authToken);

module.exports = {
	call: function(userId) {
		// TODO: From DB, grab phone based on userId
		let user = {
			phone: '+16505421376'
		}

		client.calls.create({
			url: process.env.TWILIO_XML_URL,
			from: process.env.TWILIO_FROM,
			to: user.phone,
			method: 'GET'
		}, (err, call) => {
			if (err) {
				console.error('Error: ', err);
			} else {
				console.log('Call SID: ', call.sid);			
			}
		});
	}
}

// client.messages.create({
// 	body: 'testing message',
// 	to: '+16505421376',
// 	from: '+16502036183'
// }, function(err, message) {
// 	console.log(err, message.sid);
// })
