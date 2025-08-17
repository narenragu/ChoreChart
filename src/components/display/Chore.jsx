import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Row,
  Container,
  Card,
  Badge,
  Modal,
} from "react-bootstrap";
import { db } from "../../firebase";
import { doc, increment, updateDoc, getDoc } from "firebase/firestore";

function Chore(props) {
  const [showModal, setShowModal] = useState(false);

  async function incrementSkip(chore, user) {
    const choreRef = doc(db, "chores", chore);

    try {
      await updateDoc(choreRef, {
        [`skips.${user}`]: increment(1),
      });
    } catch (err) {
      console.error("Error updating skips:", err);
    }
  }

  async function decrementSkip(chore, user) {
    const choreRef = doc(db, "chores", chore);

    try {
      const snap = await getDoc(choreRef);
      const currentValue = snap.data()?.skips?.[user] ?? 0;

      if (currentValue > 0) {
        await updateDoc(choreRef, {
          [`skips.${user}`]: increment(-1),
        });
        return false;
      } else {
        console.log(`Skip count for ${user} is already 0`);
        return true;
      }
    } catch (err) {
      console.error("Error decrementing skips:", err);
    }
  }

  async function findNext(index) {
    index += 1;
    index %= props.rotation.length;
    const newUserID = props.rotation[index];

    // true if user is found with 0 skips
    const userFound = await decrementSkip(props.id, newUserID);

    if (userFound) {
      await updateChoreDatabase(props.id, index);
    } else if (userFound === false) {
      await findNext(index);
    }
  }

  async function updateChoreDatabase(chore, newIndex) {
    const choreRef = doc(db, "chores", chore);

    try {
      await updateDoc(choreRef, {
        assigneeIndex: newIndex,
      });
    } catch (err) {
      console.error("Error updating skips:", err);
    }
  }

  function handleConfirm() {
    if (props.rotation[props.assigneeIndex] != props.user.uid) {
      incrementSkip(props.id, props.user.uid);
    } else {
      findNext(props.assigneeIndex);
    }

    setShowModal(false);
  }

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
              {props.rotation.map((userId, index) => {
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
                      {props.userData[userId].name}
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
                      {props.userData[userId].name}{" "}
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
          {props.user ? (
            <Card.Footer className="">
              <Button
                onClick={() => {
                  setShowModal(true);
                }}
              >
                Complete Chore
              </Button>

              <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>{props.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>Are you sure you want to complete this chore?</p>
                  {props.rotation[props.assigneeIndex] != props.user.uid ? (
                    <p>
                      Since this isn't your chore, you'll be given a{" "}
                      <Badge>skip</Badge>.
                    </p>
                  ) : (
                    <></>
                  )}
                  <input type="date" />
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleConfirm}>
                    Confirm
                  </Button>
                </Modal.Footer>
              </Modal>
            </Card.Footer>
          ) : (
            ""
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default Chore;
