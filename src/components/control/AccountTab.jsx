import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Alert, Button, Card, Form, InputGroup } from "react-bootstrap";
import { useState } from "react";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  signOut,
  updatePassword,
} from "firebase/auth";
import { useNavigate } from "react-router";
import { useErrorTimeout } from "../../hooks/useErrorTimeout";

export default function AccountTab(props) {
  let navigate = useNavigate();
  const [error, setError] = useState({
    type: "error",
    msg: "",
    timestamp: Date.now(),
  });
  const [passwordError, setPasswordError] = useState({
    type: "error",
    msg: "",
    timestamp: Date.now(),
  });

  //hook for timeout
  useErrorTimeout(error, setError);
  useErrorTimeout(passwordError, setPasswordError);

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

  function changePassword(e, user) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const oldPassword = formData.get("oldPassword");
    const newPassword = formData.get("newPassword");

    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    reauthenticateWithCredential(user, credential)
      .then(() => {
        // Update the password
        updatePassword(user, newPassword)
          .then(() => {
            console.log("Password updated successfully!");
            setPasswordError({
              type: "success",
              msg: "Password updated successfully!",
              timestamp: Date.now(),
            });
          })
          .catch((error) => {
            console.error("Error updating password:", error.message);
            setPasswordError({
              type: "error",
              msg: `${error.message}`,
              timestamp: Date.now(),
            });
          });
      })
      .catch((error) => {
        console.error("Error reauthenticating:", error.message);
        setPasswordError({
          type: "error",
          msg: `${error.message}`,
          timestamp: Date.now(),
        });
      });
  }

  return (
    <>
      <Alert
        show={!props.userData[props.user.uid]?.isVerified}
        variant="warning"
      >
        Your account is unverified. You can only edit your own account
        information until your account is verified by admin.
      </Alert>
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
      <Card>
        <Card.Header>
          <h4>Change Password</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={(e) => changePassword(e, props.user)}>
            <Form.Control
              name="oldPassword"
              placeholder="Enter Old Password"
              type="password"
            ></Form.Control>
            <Form.Control
              name="newPassword"
              placeholder="Enter New Password"
              type="password"
            ></Form.Control>
            <Alert
              show={passwordError.msg != ""}
              variant={passwordError.type == "error" ? "danger" : "primary"}
            >
              {passwordError.msg}
            </Alert>
            <br></br>
            <div className="d-flex justify-content-center">
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <hr></hr>
      <div className="d-flex justify-content-center">
        <Button variant="secondary" onClick={() => navigate("/display")}>
          View Chart (Desktop Only)
        </Button>
      </div>
      <hr></hr>
      <div className="d-flex justify-content-center">
        <Button variant="danger" onClick={() => signOut(getAuth())}>
          Sign Out
        </Button>
      </div>
    </>
  );
}
