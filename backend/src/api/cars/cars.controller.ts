import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../../exceptions';

import { fetchCarList } from './cars.service';

export const getCarList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cars = await fetchCarList();
    res.status(200).json(cars);
  } catch (error: unknown) {
    next(new HttpException(400, (error as Error).message));
  }
}