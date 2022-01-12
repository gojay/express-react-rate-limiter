import express from 'express';
import bodyParser from 'body-parser';

import { corsMiddleware, rateLimitMiddleware, errorMiddleware } from './middlewares';
import apiRouter from './api';

const server = express();

server.use(bodyParser.json());
server.use(corsMiddleware)
server.use(rateLimitMiddleware);
server.use(errorMiddleware);

server.use('/api', apiRouter);

export default server
