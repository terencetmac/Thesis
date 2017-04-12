import request from 'supertest-as-promised';
import app from '../../../server/server.js';

describe('Calling API tests', () => {
	beforeEach(() => {
 		// process.env.NODE_ENV = 'test';
 		// app = require('../../../server/server.js');
	});

	afterAll((done) => {
		app.close(done);
		// delete process.env.NODE_ENV;
	});

	it('/api/calling/call should respond to a POST request.', () => {
		return request(app).post('/api/calling/call')
			.expect(200)
	});

	it('/api/calling/called should respond to a POST request for Twilio', () => {
		return request(app).post('/api/calling/called')
			.expect(200)
			.then((res) => {
				expect(res.header['content-type']).toEqual('text/xml; charset=utf-8');
			});
	});
});