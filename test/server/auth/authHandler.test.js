jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
require('dotenv').config();
const request = require('supertest');
const app = require('../../../server/server.js').app;
let db = null;
const dbConfig = require('../../../db/config.js');
db = dbConfig.db;

jest.mock('../../../server/calling/config.js');
const Call = require('../../../server/calling/config.js');

const resetDb = () => {
	return db.none('TRUNCATE users RESTART IDENTITY CASCADE');
}

describe('authHandler tests', () => {

	test('should handle POST /signup route', () => {
		const user = {
			email: 'newUser@mail.com',
			firstName: 'New user',
			lastName: 'To be deleted',
			password: 'password',
			phone: '6505421376'
		};

		return resetDb().then(() => {
			return request(app)
				.post('/api/auth/signup')
				.send(user)
				.then((res) => {
					expect(Call.sendVerification).toBeCalledWith(user.phone);
					expect(res.statusCode).toEqual(200);
					expect(res.body.user).toBeDefined();
					expect(res.body.token).toBeDefined();
				});
		});
	});

	test('should send an error message if email exists in the DB', () => {
		return resetDb().then(() => {
			return request(app).post('/api/auth/signup')
				.send({
					email: 'newUser@mail.com',
					firstName: 'New user',
					lastName: 'To be deleted',
					password: 'password',
					phone: '6505421376'
				})
			})
			.then(() => {
				return request(app).post('/api/auth/signup')
					.send({
						email: 'newUser@mail.com',
						firstName: 'New user',
						lastName: 'To be deleted',
						password: 'password',
						phone: '6505421376'
					})
					.expect(400)
				})
				.then(res => {
					expect(res.error.text).toBeDefined();
				});
	});

	test('should handle POST /login route', () => {
		return resetDb().then(() => {
			return request(app).post('/api/auth/signup')
				.send({
					email: 'newUser@mail.com',
					firstName: 'New user',
					lastName: 'To be deleted',
					password: 'password',
					phone: '6505421376'
				})
				.then(() => {
					return request(app).post('/api/auth/login')
					.send({
						email: 'newUser@mail.com',
						password: 'password'
					})
					.expect(200)
				})
				.then(res => {
					expect(res.body.user).toBeDefined();
					expect(res.body.token).toBeDefined();
				});
		});
	});

	test('should send an error message if login fails.', () => {
		return request(app).post('/api/auth/login')
			.send({
				email: 'newUser@mail.com',
				password: 'wrongpassword'
			})
			.expect(401)
			.then(res => {
				expect(res.error.text).toBeDefined();
			});
	});

	/**
	 * 3rd party API call route, not testing for now
	 */
	// test('should handle POST /verify route', () => {
	// 	const Call = require('../../../server/calling/config.js');
	// 	Call.verify = jest.fn(() => {
	// 		return Promise.resolve('value');
	// 	});
	// 	return request(app).post('/api/auth/verify')
	// 		.send({
	// 			verificationCode: '0562'
	// 		})
	// 		.expect(200)
	// });	

});