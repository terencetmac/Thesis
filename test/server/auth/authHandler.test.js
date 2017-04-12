import request from 'supertest-as-promised';
import app from '../../../server/server.js';
let db = null;
const dbConfig = require('../../../db/config.js');
db = dbConfig.db;
dbConfig.loadDb(db);
jest.mock('../../../server/calling/config.js');

describe('authHandler tests', () => {

	beforeAll(() => {
	  process.env.NODE_ENV = 'test';
	});

	afterAll(() => {
		app.close();
	  delete process.env.NODE_ENV;
		return db.one("DELETE FROM users WHERE email = 'newUser@mail.com'");	
	});

	it('should handle POST /signup route', () => {
		return request(app).post('/api/auth/signup')
			.send({
				email: 'newUser@mail.com',
				firstName: 'New user',
				lastName: 'To be deleted',
				password: 'password',
				phone: '7582931276'
			})
			.expect(200)
			.then(res => {
				expect(res.body.user).toBeDefined();
				expect(res.body.token).toBeDefined();
			});
	});

	it('should send an error message if email exists in the DB', () => {
		return request(app).post('/api/auth/signup')
			.send({
				email: 'newUser@mail.com',
				firstName: 'New user',
				lastName: 'To be deleted',
				password: 'password',
				phone: '7582931276'
			})
			.expect(400)
			.then(res => {
				expect(res.error.text).toBeDefined();
			});
	});

	it('should handle POST /login route', () => {
		return request(app).post('/api/auth/login')
			.send({
				email: 'terence@mail.com',
				password: 'password'
			})
			.expect(200)
			.then(res => {
				expect(res.body.user).toBeDefined();
				expect(res.body.token).toBeDefined();
			});
	});

	it('should send an error message if login fails.', () => {
		return request(app).post('/api/auth/login')
			.send({
				email: 'terence@mail.com',
				password: 'wrongpassword'
			})
			.expect(401)
			.then(res => {
				expect(res.error.text).toBeDefined();
			})
	});

	/**
	 * 3rd party API call route, not testing for now
	 */
	// it('should handle POST /verify route', () => {
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