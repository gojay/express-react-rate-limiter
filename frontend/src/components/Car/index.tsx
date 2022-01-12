import React from "react";
import CarList from "./CarList";
import { CarProvider } from "../../contexts";

const Car: React.FC = () => {
  return (
    <CarProvider>
      <CarList />
    </CarProvider>
  );
};

export default Car;
