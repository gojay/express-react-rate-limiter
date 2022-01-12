import React, { createContext, useReducer } from "react";
import { CarActions, CarState } from "./carType";
import { carReducer } from "./carReducer";

const initialCar: CarState = {
  cars: [],
  loading: false,
  error: null,
}

const CarContext = createContext<{
  state: CarState,
  dispatch: React.Dispatch<CarActions>,
}>({
  state: initialCar,
  dispatch: () => null
});

const CarProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(carReducer, initialCar);

  return (
    <CarContext.Provider value={{ state, dispatch }}>
      {children}
    </CarContext.Provider>
  )
}

export { CarContext, CarProvider }
