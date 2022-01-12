# Node Js Request Rate Limiter 

Backend is build using [Express.js](https://expressjs.com/) web framework, and is using [Typescript](https://www.typescriptlang.org/).

## Commands

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn start

yarn run v1.22.5
$ npx jest --detectOpenHandles
 PASS  src/api/cars/cars.spec.ts
  test api/cars
    ✓ should respond 200 for request 1 (100 ms)
    ✓ should respond 200 for request 2 (10 ms)
    ✓ should respond 200 for request 3 (11 ms)
    ✓ should respond 200 for request 4 (8 ms)
    ✓ should respond 200 for request 5 (9 ms)
    ✓ should respond 200 for request 6 (10 ms)
    ✓ should respond 200 for request 7 (7 ms)
    ✓ should respond 200 for request 8 (8 ms)
    ✓ should respond 200 for request 9 (8 ms)
    ✓ should respond 200 for request 10 (10 ms)
    ✓ should respond 429 for request 11 (8 ms)
    waiting 3 minutes for bypass blocking request
      ✓ should respond 200 for request 1 (9 ms)
      ✓ should respond 200 for request 2 (8 ms)
      ✓ should respond 200 for request 3 (9 ms)
      ✓ should respond 200 for request 4 (8 ms)
      ✓ should respond 200 for request 5 (7 ms)
      ✓ should respond 200 for request 6 (7 ms)
      ✓ should respond 200 for request 7 (9 ms)
      ✓ should respond 200 for request 8 (8 ms)
      ✓ should respond 200 for request 9 (7 ms)
      ✓ should respond 200 for request 10 (8 ms)
      waiting 2 minutes for request more than interval
        ✓ should respond 200 for request 11 (8 ms)
        ✓ should respond 200 for request 12 (8 ms)
        ✓ should respond 200 for request 13 (7 ms)

Test Suites: 1 passed, 1 total
Tests:       24 passed, 24 total
Snapshots:   0 total
Time:        2.588 s
Ran all test suites.
Done in 3.14s.
```

Testing:

```bash
# run all tests
yarn test

# run all tests in watch mode
yarn test:watch
```

Docker:

```bash
# run docker container in development mode
docker-compose up
```

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
# Node env
NODE_ENV=development

# Port number
APP_PORT=8080

# Rate limit max requests
RATE_LIMIT_MAX_REQUESTS=10 
# Rate limit interval in minutes
RATE_LIMIT_INTERVAL_IN_MINUTES=2
# Rate limit block interval in minutes
RATE_LIMIT_BLOCK_INTERVAL_IN_MINUTES=3
# Rate limit to clean up client requests in minutes
RATE_LIMIT_CLEAN_INTERVAL_IN_MINUTES=1
```

### API Endpoints

List of available routes:

**Car routes**:\
`GET /api/cars` - get car list