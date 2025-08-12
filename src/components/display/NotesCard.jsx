import { useState } from "react";
import { Button, Col, Row, Container, Card } from "react-bootstrap";

function NotesCard() {
  return (
    <>
      <Card className="h-100 w-100" style={{ background: "#FF54111F" }}>
        <Card.Header>
          <h3>Notes</h3>
        </Card.Header>
      </Card>
    </>
  );
}

export default NotesCard;
