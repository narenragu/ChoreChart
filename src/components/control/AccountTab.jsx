import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Alert, Button, Card, Form, InputGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";

export default function AccountTab(props) {
  const [error, setError] = useState({
    type: "error",
    msg: "",
    timestamp: Date.now(),
  });

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError((err) => {
        return {
          type: err.type,
          msg: "",
          timestamp: Date.now(),
        };
      });
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  async function editUserData(user, username) {
    const docRef = doc(db, "userData", user.uid);
    return await updateDoc(docRef, {
      name: username,
    });
  }

  function changeUsername(e, user) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newName = formData.get("name");

    editUserData(user, newName)
      .then(() => {
        console.log(`Set account name to ${newName}.`);
        setError({
          type: "success",
          msg: `Set account name to ${newName}`,
          timestamp: Date.now(),
        });
      })
      .catch((error) => {
        setError({ type: "error", msg: `${error}`, timestamp: Date.now() });
        console.error(error);
      });
  }

  return (
    <>
      <Card>
        <Card.Header>
          <h4>Set Account Name</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={(e) => changeUsername(e, props.user)}>
            <InputGroup>
              <Form.Control
                name="name"
                placeholder="Enter Name"
                type="text"
              ></Form.Control>
              <Button type="submit">Submit</Button>
            </InputGroup>
          </Form>
          <Alert
            show={error.msg != ""}
            variant={error.type == "error" ? "danger" : "primary"}
          >
            {error.msg}
          </Alert>
        </Card.Body>
      </Card>
      <hr></hr>
      <div className="d-flex justify-content-center">
        <Button variant="danger" onClick={() => signOut(getAuth())}>
          Sign Out
        </Button>
      </div>
    </>
  );
}
