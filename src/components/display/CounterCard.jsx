import { useState } from "react";
import { Button, Col, Row, Container, Card } from "react-bootstrap";

function CounterCard() {
  return (
    <>
      <Card className="h-100 w-100">
        <Card.Header>
          <h3>Counters</h3>
        </Card.Header>
        <Card.Body></Card.Body>
      </Card>
    </>
  );
}

export default CounterCard;
