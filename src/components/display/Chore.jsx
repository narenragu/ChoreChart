import { useEffect, useState } from "react";
import { Button, Col, Row, Container, Card } from "react-bootstrap";

function Chore(props) {
  return (
    <>
      <Card style={{ background: props.color + "1F" }}>
        <Card.Header className="p-2">
          <h4 className="text-center">{props.name ?? "Loading..."}</h4>
        </Card.Header>
        <Card.Body className="p-1">
          <Container fluid>
            <Row className="w-100">
              {[0, 1, 2, 3, 4].map((userId, index) => {
                return index == props.assigneeIndex ? (
                  <Col
                    key={userId}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <h1
                      className="text-center p-1 m-0 rounded w-100"
                      style={{
                        background: "#0000005F",
                      }}
                    >
                      {props.userMap[userId]}
                    </h1>
                  </Col>
                ) : (
                  <Col
                    md="auto"
                    key={userId}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <h5
                      className="text-center rounded p-2 m-0"
                      style={{
                        background: "#0000001F",
                        mixBlendMode: "overlay",
                      }}
                    >
                      {props.userMap[userId]}
                    </h5>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </Card.Body>
      </Card>
    </>
  );
}

export default Chore;
