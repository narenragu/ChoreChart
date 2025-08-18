import { Card, Container, Row, Col, Badge, Table } from "react-bootstrap";

export default function Counter(props) {
  return (
    <Card>
      <Card.Header className="p-1 m-0">
        <Container className="p-0">
          <Row className="px-2">
            <Col>
              <h4 className="p-0 m-0">{props.name}</h4>
            </Col>
            <Col md="auto">
              <h5>
                <Badge bg="secondary">Total: {props.total}</Badge>
              </h5>
            </Col>
          </Row>
        </Container>
      </Card.Header>

      <Card.Body>
        <Table bordered>
          <tbody>
            {Object.keys(props.data)
              .filter((userID) => props.data[userID])
              .map((userID) => (
                <tr key={userID}>
                  <td
                    style={{
                      backgroundColor: "#343a401F",
                    }}
                    className="p-2"
                  >
                    <h5 className="m-0">{props.userData[userID].name}</h5>
                  </td>
                  <td style={{ backgroundColor: "#343a40" }} className="p-2">
                    <div className="d-flex justify-content-center">
                      <h5 className="m-0">{props.data[userID]}</h5>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        <br></br>
      </Card.Body>
    </Card>
  );
}
