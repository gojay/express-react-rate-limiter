import React, { useCallback, useEffect, useState } from "react";
import CarItem from "./CarItem";
import { useCar } from "../../hooks";
import {
  Alert,
  Button,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";

import "./CarList.css";
import { debounce } from "../../utils";

const CarList: React.FC = () => {
  const {
    cars,
    loading,
    error,
    rateLimit,
    isRequestBlocked,
    retryAfterInterval,
    fetchCars,
  } = useCar();

  const [isEnable, setIsEnable] = useState(false);

  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isRequestBlocked) {
      setIsEnable(false);
    }
  }, [isRequestBlocked, setIsEnable]);

  const debounceGetCartsOnClick = useCallback(
		debounce(fetchCars, 300),
		[],
	);

  return (
    <Container className="mt-5">
      {!!rateLimit && (
        <Alert variant="primary">
          <Alert.Heading>Request Rate Limit</Alert.Heading>
          <p>Request Limit: {rateLimit.rateLimitLimit}</p>
          <p>Request Remaining: {rateLimit.rateLimitRemaining}</p>
          {!!rateLimit?.retryAfter && (
            <p>Request Retry After: {retryAfterInterval} seconds</p>
          )}
        </Alert>
      )}

      <Row>
        <Col md={4}>
          <Button
            variant="primary"
            onClick={debounceGetCartsOnClick}
            disabled={isRequestBlocked && !isEnable}
          >
            Get cars
          </Button>
        </Col>
        {isRequestBlocked && (
          <Col md={{ span: 4, offset: 4 }} style={{ textAlign: "right" }}>
            <Button variant="secondary" onClick={() => setIsEnable(true)}>
              Enable Get cars button
            </Button>
          </Col>
        )}
      </Row>

      {loading && (
        <Container className="my-2">
          <Spinner animation="border" role="status" as="span" size="sm" />{" "}
          Loading
        </Container>
      )}

      {error && (
        <Alert variant="danger" className="my-2">
          <Alert.Heading>Error {error.status}</Alert.Heading>
          <p>{error.message}</p>
        </Alert>
      )}

      <Row className="my-2 display-flex">
        {cars.map((car) => (
          <Col key={car.id} xs={4}>
            <CarItem car={car} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CarList;
