import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Row,
  Container,
  Card,
  Badge,
  Modal,
  Form,
} from "react-bootstrap";

function Note(props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMessage, setEditMessage] = useState(props.message);

  let color = undefined;

  function handleEdit() {
    setShowEditModal(false);
    props.editNote(props.id, editMessage);
  }

  function handleDelete() {
    setShowDeleteModal(false);
    props.deleteNote(props.id);
  }

  return (
    <>
      <Card className="my-2">
        <Card.Header className="p-0" style={{ background: color + "1F" }}>
          <Container className="p-0">
            <Row className="px-2">
              <Col>
                <h4 className="p-0">{props.userData[props.userID].name}</h4>
              </Col>
              <Col md="auto">
                <h5>
                  <Badge>
                    {"Posted " +
                      new Date(props.datePosted.seconds * 1000).toDateString()}
                  </Badge>
                </h5>
              </Col>
            </Row>
          </Container>
        </Card.Header>
        <Card.Body className="p-1" style={{ background: color + "08" }}>
          <p className="m-0">{props.message}</p>
        </Card.Body>
        {props.user && (
          <Card.Footer>
            {props.user.uid === props.userID && (
              <Button
                onClick={() => {
                  setShowEditModal(true);
                }}
                variant="secondary"
              >
                Edit
              </Button>
            )}
            <Button
              onClick={() => {
                setShowDeleteModal(true);
              }}
              variant="danger"
            >
              Delete
            </Button>
            {/* edit modal*/}
            <Modal
              show={showEditModal}
              onHide={() => setShowEditModal(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Edit note</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Control
                    onChange={(e) => {
                      setEditMessage(e.target.value);
                    }}
                    value={editMessage}
                    as="textarea"
                    rows={5}
                  ></Form.Control>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleEdit}>
                  Save
                </Button>
              </Modal.Footer>
            </Modal>
            {/* delete modal */}
            <Modal
              show={showDeleteModal}
              onHide={() => setShowDeleteModal(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Edit note</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Are you sure you want to delete this note?</p>
                <p>This can't be reverted.</p>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </Card.Footer>
        )}
      </Card>
    </>
  );
}

export default Note;
