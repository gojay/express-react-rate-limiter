import supertest from 'supertest';

import app from 'server';

const rateLimitMaxRequest = Number(process.env.RATE_LIMIT_MAX_REQUESTS);
const rateLimitIntervalInMinutes = Number(process.env.RATE_LIMIT_INTERVAL_IN_MINUTES);
const rateLimitBlockIntervalInMinutes = Number(process.env.RATE_LIMIT_BLOCK_INTERVAL_IN_MINUTES);
const rateLimitBlockIntervalInMilliseconds = rateLimitBlockIntervalInMinutes * 60 * 1000;

describe('test api/cars', () => {

	afterEach(() => {
		jest.resetModules();
	});

	for (let i = 1; i <= rateLimitMaxRequest; i++) {
		it(`should respond 200 for request ${i}`, async (done) => {
			const res = await supertest(app)
				.get('/api/cars')
				.expect(200);
			expect(res.body.length).toBeGreaterThan(0);
			done();
		});
	}

	it(`should respond 429 for request ${rateLimitMaxRequest + 1}`, async (done) => {
		const res = await supertest(app)
			.get('/api/cars')
			.expect(429)
		expect(res.body.message).toBeTruthy();
		done();
	});

	describe(`waiting ${rateLimitBlockIntervalInMinutes} minutes for bypass blocking request`, () => {
		beforeAll(() => {
			jest.useFakeTimers('modern');
			jest.setSystemTime(Date.now() + rateLimitBlockIntervalInMilliseconds + 1000)
		});

		afterAll(() => {
			jest.useRealTimers();
		});

		for (let i = 1; i <= rateLimitMaxRequest; i++) {
			it(`should respond 200 for request ${i}`, async (done) => {
				const res = await supertest(app)
					.get('/api/cars')
					.expect(200);
				expect(res.body.length).toBeGreaterThan(0);
				done();
			});
		}

		describe(`waiting ${rateLimitIntervalInMinutes} minutes for request more than interval`, () => {
			beforeAll(() => {
				jest.setSystemTime(Date.now() + (rateLimitIntervalInMinutes * 60 * 1000) + 1000)
			});

			for (let i = rateLimitMaxRequest+1; i <= rateLimitMaxRequest+3; i++) {
				it(`should respond 200 for request ${i}`, async (done) => {
					const res = await supertest(app)
						.get('/api/cars')
						.expect(200);
					expect(res.body.length).toBeGreaterThan(0);
					done();
				});
			}
		});
	});
})
