import { CarActions, CarState, CarType } from "./carType";

export const carReducer = (
  state: CarState,
  action: CarActions
) => {
  switch (action.type) {
    case CarType.SET:
      return {
        ...state,
        cars: action.payload.cars
      };

    case CarType.LOADING:
      return {
        ...state,
        loading: action.payload.loading,
      };

    case CarType.ERROR:
      return {
        ...state,
        error: action.payload.error
      }

    case CarType.RATE_LIMIT:
      return {
        ...state,
        rateLimit: {
          ...state.rateLimit,
          ...action.payload.rateLimit
        }
      }

    default:
      return state;
  }
}