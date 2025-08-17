import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { updateDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase.js";
import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
  FloatingLabel,
  Alert,
} from "react-bootstrap";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState({
    msg: "You are currently logged out.",
    timestamp: Date.now(),
  });

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError({
        msg: "",
        timestamp: Date.now(),
      });
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  function login(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then((userCredential) => {
        console.log("Signed in:", userCredential.user);
      })
      .catch((error) => {
        setError({ msg: error.message, timestamp: Date.now() });
        console.error(error.message);
      });
  }
  function signup(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return createUserWithEmailAndPassword(auth, email, password);
      })
      .then((userCredential) => {
        console.log("Signed up and signed in:", userCredential.user);
        return createUserData(userCredential.user);
      })
      .then(() => {
        console.log("Added user data to database.");
      })
      .catch((error) => {
        setError({ msg: error.message, timestamp: Date.now() });
        console.error(error.message);
      });
  }

  async function createUserData(user) {
    const docRef = doc(db, "userData", user.uid);
    return await setDoc(docRef, {
      name: "Unknown",
      email: user.email,
    });
  }

  function toggleLogin() {
    setIsSignup(!isSignup);
  }

  return (
    <>
      <Container className="py-2">
        <Row>
          <Col>
            <h1>Chore Chart Remote</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h3>{isSignup ? "Sign Up" : "Login"}</h3>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={isSignup ? signup : login}>
                  <Form.Group>
                    {/* <Form.Label>Email Address</Form.Label> */}
                    <FloatingLabel label="Email Address">
                      <Form.Control
                        name="email"
                        type="email"
                        placeholder="Enter email"
                      />
                    </FloatingLabel>
                  </Form.Group>
                  <br></br>
                  <Form.Group>
                    <FloatingLabel label="Password">
                      <Form.Control
                        name="password"
                        type="password"
                        placeholder="Enter password"
                      />
                    </FloatingLabel>
                  </Form.Group>
                  <hr></hr>
                  <div>
                    <Button type="submit">
                      {isSignup ? "Sign Up" : "Login"}
                    </Button>
                    <Button onClick={toggleLogin} variant="secondary">
                      {isSignup ? "Existing User" : "New User"}
                    </Button>
                  </div>
                  <br />
                  <Alert show={error.msg != ""} variant="warning">
                    {error.msg}
                  </Alert>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
