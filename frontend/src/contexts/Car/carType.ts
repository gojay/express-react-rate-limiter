import { RequestRateLimit } from "../../types"
import { ActionMap } from "../../types/context"

export type Car = {
  id: number,
  year: number,
  horsepower: number,
  make: string,
  model: string,
  price: number,
  img_url: string
}

export type CarState = {
  cars: Car[],
  loading: boolean,
  error: {
    status: number,
    message: string
  } | null,
  rateLimit?: RequestRateLimit
}

export enum CarType {
  SET = 'SET_CAR',
  LOADING = 'LOADING_CAR',
  ERROR = 'ERROR_CAR',
  RATE_LIMIT = 'RATE_LIMIT'
}

export type CarPayload = {
  [CarType.SET]: Pick<CarState, 'cars'>,
  [CarType.LOADING]: Pick<CarState, 'loading'>,
  [CarType.ERROR]: Pick<CarState, 'error'>,
  [CarType.RATE_LIMIT]: {
    rateLimit: RequestRateLimit
  }
}

export type CarActions = ActionMap<CarPayload>[keyof ActionMap<CarPayload>];