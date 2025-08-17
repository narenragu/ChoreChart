import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import Note from "../display/Note";
import { Button, Form, Modal } from "react-bootstrap";

export default function NotesTab(props) {
  const [notes, setNotes] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createMessage, setCreateMessage] = useState("");

  useEffect(() => {
    async function fetchNotes() {
      const notes = collection(db, "notes");
      let notesList = await getDocs(notes);
      notesList = notesList.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesList);
    }

    fetchNotes();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "notes"), (notes) => {
      notes = notes.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notes);
    });

    return () => unsub();
  }, []);

  async function deleteNote(id) {
    try {
      await deleteDoc(doc(db, "notes", id));
      console.log("Document deleted:", id);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  }

  async function editNote(id, message) {
    try {
      const docRef = doc(db, "notes", id);

      await updateDoc(docRef, { message: message });

      console.log("Document updated:", id);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }

  async function createNote() {
    setShowCreateModal(false);

    const newNote = {
      datePosted: new Date(),
      message: createMessage,
      userID: props.user.uid,
    };
    try {
      const docRef = await addDoc(collection(db, "notes"), newNote);
      console.log("Document written with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding document:", error);
    }
  }

  return (
    <>
      <div className="d-flex justify-content-center">
        <Button
          onClick={() => {
            setShowCreateModal(true);
            setCreateMessage("");
          }}
        >
          + Add Note
        </Button>
      </div>
      <hr></hr>
      {notes
        .sort((a, b) => b.datePosted - a.datePosted)
        .map((note) => {
          return (
            <Note
              {...note}
              userData={props.userData}
              key={note.datePosted}
              user={props.user}
              editNote={editNote}
              deleteNote={deleteNote}
            ></Note>
          );
        })}

      {/* Add note modal */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create new note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              onChange={(e) => {
                setCreateMessage(e.target.value);
              }}
              value={createMessage}
              as="textarea"
              rows={5}
            ></Form.Control>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={createNote}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
