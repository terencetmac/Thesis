jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
require('dotenv').config();
import request from 'supertest-as-promised';
import { app } from '../../../server/server.js';
let db = null;
let server = null;

jest.mock('../../../server/calling/config.js');

const resetDb = () => {
	return db.none('TRUNCATE users RESTART IDENTITY CASCADE');
}

describe('authHandler tests', () => {
	beforeAll(() => {
	  if (process.env.IS_ON === 'development') {
	    process.env.DATABASE_URL = 'postgres://@localhost:5432/reflectivetest';
	  }		
		const dbConfig = require('../../../db/config.js');
		db = dbConfig.db;
		server = app.listen('1234', () => {
  		console.log(`listening on port 1234...`);
		});
		return dbConfig.loadDb(db);
	});

	afterAll((done) => {
		process.env.DATABASE_URL = 'postgres://@localhost:5432/reflective';
		server.close(() => {
	    console.log("Closed server 1234.");
	    done();
  	});
	});

	test('should handle POST /signup route', () => {
		return resetDb().then(() => {
			return request(server).post('/api/auth/signup')
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
	});

	test('should send an error message if email exists in the DB', () => {
		return resetDb().then(() => {
			return request(server).post('/api/auth/signup')
				.send({
					email: 'newUser@mail.com',
					firstName: 'New user',
					lastName: 'To be deleted',
					password: 'password',
					phone: '7582931276'
				})
		}).then(() => {
			return request(server).post('/api/auth/signup')
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
	});

	test('should handle POST /login route', () => {
		return resetDb().then(() => {
			return request(server).post('/api/auth/signup')
				.send({
					email: 'newUser@mail.com',
					firstName: 'New user',
					lastName: 'To be deleted',
					password: 'password',
					phone: '7582931276'
				});
		})
		.then(() => {
			return request(server).post('/api/auth/login')
			.send({
				email: 'newUser@mail.com',
				password: 'password'
			})
			.expect(200)
			.then(res => {
				expect(res.body.user).toBeDefined();
				expect(res.body.token).toBeDefined();
			});
		})
	});

	test('should send an error message if login fails.', (done) => {
		return request(server).post('/api/auth/login')
			.send({
				email: 'newUser@mail.com',
				password: 'wrongpassword'
			})
			.expect(401)
			.then(res => {
				expect(res.error.text).toBeDefined();
				done();
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