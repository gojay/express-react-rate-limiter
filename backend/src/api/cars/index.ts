import { Router } from 'express';
import { getCarList } from './cars.controller';

const carsRouter = Router();

carsRouter.get('/', getCarList);

export default carsRouter;