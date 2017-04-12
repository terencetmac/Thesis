import request from 'supertest-as-promised';
import app from '../../../server/server.js';
let db = null;
const dbConfig = require('../../../db/config.js');
db = dbConfig.db;
dbConfig.loadDb(db);

describe('authHandler tests', () => {

	beforeAll(() => {
	  process.env.NODE_ENV = 'test';
	});

	afterAll(() => {
		app.close();
	  delete process.env.NODE_ENV;
		return db.one("DELETE FROM users WHERE email = 'terence@mail.com'");	
	});

	it('should handle POST /signup route', () => {
		return request(app).post('/api/auth/signup')
			.send({
				email: 'terence@mail.com',
				firstName: 'Terence',
				lastName: 'Tham',
				password: 'password',
				phone: '6505421376'
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
				email: 'terence@mail.com',
				firstName: 'Terence',
				lastName: 'Tham',
				password: 'password',
				phone: '6505421376'
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
	});

	// it('should handle POST /verify route', () => {
	// 	return request(app).post('/api/auth/verify')
	// 		.expect(200)
	// });	

});