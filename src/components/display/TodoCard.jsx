import { useState } from "react";
import { Button, Col, Row, Container, Card } from "react-bootstrap";

function TodoCard() {
  return (
    <>
      <Card className="h-100 w-100" style={{ background: "#FFA6001F" }}>
        <Card.Header>
          <h3>Todos</h3>
        </Card.Header>
      </Card>
    </>
  );
}

export default TodoCard;
