require('dotenv').config();
const auth = require('../../../server/auth/utils.js');
const express = require('express');
const request = require('supertest-as-promised');

process.env.JWT_SECRET = 'secret';

describe('Auth Utils tests', () => {

	afterAll(() => {
	});

	it('should have `hash, compare, sign and verify` functions', () => {
		expect(auth.hash).toBeDefined();
		expect(auth.compare).toBeDefined();
		expect(auth.sign).toBeDefined();
		expect(auth.verify).toBeDefined();
	});

	describe('Auth Hash utilities', () => {

		const plainTextPassword = 'all your bases are belong to us';
		const hashedPassword = '$2a$10$MkqMXMJAgsWxPY/qGTGYduuJnkqcA3g4A/x0FHaOtDNkUJ1dMgDp.';
		
		it('`hash` should return promise with hash value', () => {
			return auth.hash(plainTextPassword).then(val => {
				expect(val).toBeDefined();
			});
		});

		it('`compare` should return promise with boolean', () => {
			return auth.compare(plainTextPassword, hashedPassword).then(val => {
				expect(typeof val).toBe('boolean');
			});
		});

	});

	describe('JWT utilities', () => {

		const user = {
			email: 'terence@email.com',
			token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlcmVuY2VAZW1haWwuY29tIiwiaWF0IjoxNDkxOTQzODU3LCJleHAiOjE0OTIxMTY2NTd9.hKSNpf7n65iFpCOahyK8tX9W-IP3-Ng9lY_B2DesPWw'
		}

		it('`sign` should return a promise', () => {
			return auth.sign(user).then(val => {
				expect(val).toBeDefined();
			})
		});

		it('`verify` should return a promise', () => {
			return auth.verify(user.token).then(result => {
				expect(result.email).toEqual(user.email);
			})
		});

	});

	describe('Auth Middleware test', () => {
		
		it('sets req.user with user if successful.', () => {	
			let app = express();
			let token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlcmVuY2VAZW1haWwuY29tIiwiaWF0IjoxNDkxOTQzODU3LCJleHAiOjE0OTIxMTY2NTd9.hKSNpf7n65iFpCOahyK8tX9W-IP3-Ng9lY_B2DesPWw';

			app.use(auth.authMiddleware, (req, res, next) => {
				expect(req.user).toBeDefined();
				res.end();
			});

			return request(app)
				.get('/')
				.set({ 'authorization': token })
				.expect(200)
		});

		it('returns an error if no token is set', () => {
			let app = express();
			let token = 'Bearer this is an invalid token';

			app.use(auth.authMiddleware, (req, res, next) => {
				res.end();
			});
			
			return request(app)
				.get('/')
				.set({ 'authorization': token })
				.expect(401)
		});
	});

});

