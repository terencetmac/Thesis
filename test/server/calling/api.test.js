import request from 'supertest';
import { app } from '../../../server/server.js';

describe('Calling API tests', () => {

	it('/api/calling/call should respond to a POST request.', (done) => {
		return request(app).post('/api/calling/call')
			.expect(200)
			.then(() => {
				done();
			});
	});

	it('/api/calling/called should respond to a POST request for Twilio', (done) => {
		return request(app).post('/api/calling/called')
			.expect(200)
			.then((res) => {
				expect(res.header['content-type']).toEqual('text/xml; charset=utf-8');
				done();
			});
	});
});