jest.disableAutomock();
jest.unmock('supertest').unmock('../../../server/server.js');

// import request from 'supertest-as-promised';
// import express from 'express';
let app;

describe('Calling API tests', () => {
	beforeEach(() => {
 		process.env.NODE_ENV = 'test';
 	//	app = require('../../../server/server.js');
	});

	afterEach(() => {
		//app.close(done);
	//	delete process.env.NODE_ENV;
	});

	it('should run a test', (done) => {
		expect(true).toBe(true);
			// return request(app)
			// .post('/api/calling/call')
			// .send({userId: 1, token: 'R234FFDnekgj342'})
			// .end((req, res) => {
			// 	expect(res.statusCode).toBe(201);
			// 	done();
			// })
	});
});
