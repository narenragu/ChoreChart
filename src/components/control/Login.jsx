import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
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
  Modal,
  InputGroup,
} from "react-bootstrap";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState({
    msg: "You are currently logged out.",
    timestamp: Date.now(),
  });
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetError, setResetError] = useState({
    msg: "",
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

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setResetError({
        msg: "",
        timestamp: Date.now(),
      });
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [resetError]);

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
        if (!userCredential.user.emailVerified) {
          setError({
            msg: "You must verify your email before logging in.",
            timestamp: Date.now(),
          });
          auth.signOut();
          return;
        }
        window.location.reload();
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
    const name = formData.get("name");

    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return createUserWithEmailAndPassword(auth, email, password);
      })
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log("Signed up and signed in:", user);

        await sendEmailVerification(user);
        setError({
          msg: "Verification email sent! Please check your inbox.",
          timestamp: Date.now(),
        });
        setIsSignup(false);
        const result = await createUserData(userCredential.user, name);
        auth.signOut();
        return result;
      })
      .then(() => {
        console.log("Added user data to database.");
      })
      .catch((error) => {
        setError({ msg: error.message, timestamp: Date.now() });
        console.error(error.message);
      });
  }

  async function resetPassword(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("resetEmail");

    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      setResetError({
        msg: "Password reset email sent! Check your inbox.",
        timestamp: Date.now(),
      });
    } catch (err) {
      setResetError({ msg: err.message, timestamp: Date.now() });
    }
  }

  async function createUserData(user, name) {
    if (!name) name = "Unknown";
    const docRef = doc(db, "userData", user.uid);
    return await setDoc(docRef, {
      name: name,
      isVerified: false,
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
                  {isSignup && (
                    <Form.Group>
                      <FloatingLabel label="First Name">
                        <Form.Control
                          name="name"
                          placeholder="Enter First Name"
                        />
                      </FloatingLabel>
                      <br></br>
                    </Form.Group>
                  )}
                  <Form.Group>
                    {/* <Form.Label>Email Address</Form.Label> */}
                    <FloatingLabel label="Email Address">
                      <Form.Control
                        name="email"
                        type="email"
                        placeholder="Enter email"
                        autoComplete="username"
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
                        autoComplete={
                          isSignup ? "new-password" : "current-password"
                        }
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

                  {!isSignup && (
                    <>
                      <br></br>
                      <Button
                        onClick={() => {
                          setShowResetModal(true);
                        }}
                        variant="outline-light"
                      >
                        Forgot Password?
                      </Button>
                    </>
                  )}
                  <br></br>
                  <Alert show={error.msg != ""} variant="warning">
                    {error.msg}
                  </Alert>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Password Reset Modal */}
      <Modal
        show={showResetModal}
        onHide={() => {
          setShowResetModal(false);
        }}
        centered
      >
        <Modal.Header closeButton>
          <h2>Reset Password</h2>
        </Modal.Header>
        <Modal.Body>
          <p>
            Enter your email, and a link will be sent to reset your password.
          </p>
          <Form onSubmit={resetPassword}>
            <InputGroup>
              <Form.Control name="resetEmail" type="email"></Form.Control>
              <Button type="submit">Send</Button>
            </InputGroup>
          </Form>
          <br></br>
          <Alert show={resetError.msg != ""} variant="warning">
            {resetError.msg}
          </Alert>
        </Modal.Body>
      </Modal>
    </>
  );
}
