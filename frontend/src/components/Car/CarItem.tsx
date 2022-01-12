import React from "react";
import Card from "react-bootstrap/esm/Card";
import { Car } from "../../contexts";

interface Props {
  car: Car;
}

const CarItem: React.FC<Props> = ({ car }) => {
  return (
    <Card key={car.id}>
      <Card.Img variant="top" src={car.img_url} />
      <Card.Body>
        <Card.Title>{car.make}</Card.Title>
        <Card.Text>
          <ul>
            <li>Model: {car.model}</li>
            <li>Price: {Number(car.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</li>
            <li>Year: {car.year}</li>
            <li>Horse Power: {Number(car.horsepower).toLocaleString()} kW</li>
          </ul>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CarItem;
