import { Router } from 'express';
import carsRouter from './cars';

const apiRouter = Router();

apiRouter.use('/cars', carsRouter);

export default apiRouter;