// jest.disableAutomock();
// jest.unmock('supertest');

// import request from 'supertest-as-promised';
// import express from 'express';
let app;

describe('Calling API tests', () => {
	beforeEach(() => {
 		// process.env.NODE_ENV = 'test';
 		// app = require('../../../server/server.js');
	});

	afterEach(() => {
		//app.close(done);
		// delete process.env.NODE_ENV;
	});

	it('should run a test', (done) => {
		expect(true).toBe(true);
	});
});
