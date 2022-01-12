import { readFile } from 'fs';

export const fetchCarList = () => {
  return new Promise((resolve, reject) => {
    readFile(`${__dirname}/cars.json`, 'utf-8', (error: any, data: string) => {
      if(error) {
        reject(error);
      } else {
        resolve(JSON.parse(data));
      }
    })
  })
};