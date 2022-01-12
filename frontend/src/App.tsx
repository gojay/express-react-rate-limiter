import React from "react";
import Car from "./components/Car";
import { Container, Navbar } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

const App: React.FC = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>React Request Rate Limiter</Navbar.Brand>
        </Container>
      </Navbar>
      <Car />
    </>
  );
}

export default App;
