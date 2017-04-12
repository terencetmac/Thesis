import request from 'supertest-as-promised';
import app from '../../../server/server.js';

describe('authHandler tests', () => {

	afterAll((done) => {
		app.close(done);
	});

	it('should handle POST /signup route', () => {
		return request(app).post('/api/auth/signup')
			.expect(200)
	});

	it('should handle POST /login route', () => {
		return request(app).post('/api/auth/login')
			.expect(200)
	});

	// it('should handle POST /verify route', () => {
	// 	return request(app).post('/api/auth/verify')
	// 		.expect(200)
	// });	

});