import { useState } from "react";
import { Button, Col, Row, Container, Card } from "react-bootstrap";

function NotesCard() {
  return (
    <>
      <Card className="h-100 w-100">
        <Card.Header style={{ background: "#FF54111F" }}>
          <h3>Notes</h3>
        </Card.Header>
        <Card.Body style={{ background: "#FF54110F" }}>
          <p>test</p>
        </Card.Body>
      </Card>
    </>
  );
}

export default NotesCard;
