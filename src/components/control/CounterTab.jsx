import { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Row,
  Col,
  Badge,
  Modal,
  Form,
} from "react-bootstrap";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function CounterTab({ userData }) {
  const [counters, setCounters] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTotal, setNewTotal] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editName, setEditName] = useState("");
  const [editTotal, setEditTotal] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "counters"), (snapshot) => {
      setCounters(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  async function updateCount(counterId, userId, delta) {
    const counterRef = doc(db, "counters", counterId);
    const counter = counters.find((c) => c.id === counterId);

    // clone data so we can safely mutate
    const newData = { ...counter.data };

    if (!newData[userId]) newData[userId] = 0;
    newData[userId] += delta;
    if (newData[userId] < 0) newData[userId] = 0;

    await updateDoc(counterRef, { data: newData });
  }

  // delete a counter
  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteDoc(doc(db, "counters", deleteTarget.id));
    setDeleteTarget(null);
    setShowDeleteModal(false);
  }

  async function handleAdd() {
    if (!newName || !newTotal) return;

    const newData = {};
    Object.keys(userData).forEach((uid) => {
      newData[uid] = 0;
    });

    await addDoc(collection(db, "counters"), {
      name: newName,
      total: parseInt(newTotal, 10),
      data: newData,
    });

    setNewName("");
    setNewTotal("");
    setShowAddModal(false);
  }

  async function handleEdit() {
    if (!editTarget) return;

    await updateDoc(doc(db, "counters", editTarget.id), {
      name: editName,
      total: parseInt(editTotal, 10),
    });

    setEditTarget(null);
    setEditName("");
    setEditTotal("");
    setShowEditModal(false);
  }

  function getTotalUsed(counter) {
    let result = 0;
    Object.keys(counter.data).forEach((user) => {
      result += counter.data[user];
    });

    return result;
  }

  return (
    <>
      <div className="mt-3 d-flex justify-content-center">
        <Button onClick={() => setShowAddModal(true)}>+ Add Counter</Button>
      </div>
      <hr></hr>
      <Accordion alwaysOpen>
        {counters.map((counter) => (
          <Accordion.Item eventKey={counter.id} key={counter.id}>
            <Accordion.Header>
              <Row className="w-100 align-items-center">
                <Col>{counter.name}</Col>
                <Col md="auto">
                  <Badge bg="secondary">Total: {counter.total}</Badge>
                </Col>
              </Row>
            </Accordion.Header>
            <Accordion.Body>
              {Object.keys(userData).map((userId) => (
                <Row
                  key={userId}
                  className="align-items-center py-2 border-bottom"
                >
                  <Col>{userData[userId]?.name || userId}</Col>
                  <Col xs="auto">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => updateCount(counter.id, userId, -1)}
                      disabled={!(counter.data[userId] ?? 0)}
                    >
                      −
                    </Button>
                  </Col>
                  <Col xs="auto">
                    <strong>{counter.data[userId] ?? 0}</strong>
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => updateCount(counter.id, userId, +1)}
                      disabled={getTotalUsed(counter) >= counter.total}
                    >
                      +
                    </Button>
                  </Col>
                </Row>
              ))}
              <br />
              <div className="d-flex justify-content-center gap-2">
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditTarget(counter);
                    setEditName(counter.name);
                    setEditTotal(counter.total);
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(counter);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Counter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Counter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Total</Form.Label>
              <Form.Control
                type="number"
                value={newTotal}
                onChange={(e) => setNewTotal(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Counter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Total</Form.Label>
              <Form.Control
                type="number"
                value={editTotal}
                onChange={(e) => setEditTotal(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
