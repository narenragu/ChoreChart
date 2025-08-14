import { useState } from "react";
import { Button, Col, Row, Container, Card } from "react-bootstrap";

function TodoCard() {
  return (
    <>
      <Card className="h-100 w-100">
        <Card.Header style={{ background: "#FFA6001F" }}>
          <h3>Todos</h3>
        </Card.Header>
        <Card.Body style={{ background: "#FFA6000F" }}>
          <p>test</p>
        </Card.Body>
      </Card>
    </>
  );
}

export default TodoCard;
