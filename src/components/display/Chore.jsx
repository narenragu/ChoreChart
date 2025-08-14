import { useEffect, useState } from "react";
import { Button, Col, Row, Container, Card, Badge } from "react-bootstrap";

function Chore(props) {
  return (
    <>
      <Card className="my-2">
        <Card.Header className="p-0" style={{ background: props.color + "1F" }}>
          <Container className="p-0">
            <Row className="px-2">
              <Col>
                <h3 className="p-0">{props.name}</h3>
              </Col>
              <Col md="auto">
                <h5>
                  <Badge
                    bg={
                      new Date(props.dueDate.seconds * 1000) < Date.now()
                        ? "danger"
                        : "secondary"
                    }
                  >
                    {new Date(props.dueDate.seconds * 1000).toDateString()}
                  </Badge>
                </h5>
              </Col>
            </Row>
          </Container>
        </Card.Header>
        <Card.Body className="p-1" style={{ background: props.color + "08" }}>
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
                      {props.userMap[userId]}{" "}
                      {props.skips?.[userId] ? (
                        <Badge bg="primary">
                          {props.skips[userId] > 1
                            ? "skip (" + props.skips[userId] + "x)"
                            : "skip"}
                        </Badge>
                      ) : (
                        ""
                      )}
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
