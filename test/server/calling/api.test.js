import request from 'supertest-as-promised';
import { app } from '../../../server/server.js';
let server = null;

describe('Calling API tests', () => {
	beforeAll(() => {
 		process.env.NODE_ENV = 'test';
 		server = app.listen('1235', () => {
  		console.log(`listening on port 1235...`);
		});
	});

	afterAll((done) => {
		server.close(() => {
	    console.log("Closed server 1234.");
	    done();
  	});
		delete process.env.NODE_ENV;
	});

	it('/api/calling/call should respond to a POST request.', (done) => {
		return request(server).post('/api/calling/call')
			.expect(200)
			.then(() => {
				done();
			});
	});

	it('/api/calling/called should respond to a POST request for Twilio', (done) => {
		return request(server).post('/api/calling/called')
			.expect(200)
			.then((res) => {
				expect(res.header['content-type']).toEqual('text/xml; charset=utf-8');
				done();
			});
	});
});