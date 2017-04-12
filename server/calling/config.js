const twilio = require('twilio');
const fetch = require('isomorphic-fetch');
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
	},

	sendVerification: function(phone, countryCode) {

		let config = {
			method: 'POST'
		};

		// TODO: Save user phone number without country code
		// TODO: Get user's phone details from user_id
		let params = buildParams({
			api_key: process.env.AUTHY_KEY,
			via: 'sms',
			phone_number: phone || '4156715732',
			country_code: countryCode || 1
		});

		fetch(`https://api.authy.com/protected/json/phones/verification/start?${params}`, config)
			.then(response => {
				console.log(response);
			})
			.catch(error => {
				console.log(error);
			});
	},

	verify: function(phone, countryCode, code) {

		let config = {
			method: 'GET'
		};

		let params = buildParams({
			api_key: process.env.AUTHY_KEY,
			phone_number: phone,
			country_code: countryCode,
			verification_code: code.toString()
		});

		return fetch(`https://api.authy.com/protected/json/phones/verification/check?${params}`, config)
			.then(response => {
				if (response.status === 200) {
					return true;
				}
			})
			.catch(error => {
				console.log(error);
				return error;
			});
	}
}

const buildParams = (params) => {
	let paramString = '';
	Object.keys(params).forEach((param, index) => {
		paramString += param;
		paramString += '=';
		paramString += params[param];
		if (index !== Object.keys(params).length-1) {
			paramString+= '&';
		}
	});
	return paramString;
}

