import { useState, useEffect } from "react";
import "./App.css";
import ChoreCard from "./components/display/ChoreCard.jsx";
import TodoCard from "./components/display/TodoCard.jsx";
import NotesCard from "./components/display/NotesCard.jsx";

import { Button, Col, Row, Container } from "react-bootstrap";

export default function App() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Container
      fluid
      className="d-flex flex-column"
      style={{ height: "100vh", padding: 0 }}
    >
      {/* Top bar with fixed height */}
      <Row style={{ height: "50px" }} className="align-items-center px-3">
        <Col>
          <h2>
            {now.toDateString()} {now.toLocaleTimeString()}
          </h2>
        </Col>
      </Row>

      {/* Main content fills remaining space */}
      <Row className="flex-grow-1" style={{ margin: 0 }}>
        {/* Left half */}
        <Col md={6} style={{ padding: "1rem", overflow: "auto" }}>
          <ChoreCard></ChoreCard>
          {/* Your content here */}
        </Col>

        {/* Right half split vertically */}
        <Col
          md={6}
          className="d-flex flex-column"
          style={{ padding: 0, height: "100%" }}
        >
          <div
            style={{
              flex: 1,
              padding: "1rem",
              overflow: "auto",
            }}
          >
            <TodoCard></TodoCard>
            {/* Content */}
          </div>
          <div style={{ flex: 1, padding: "1rem", overflow: "auto" }}>
            <NotesCard></NotesCard>
            {/* Content */}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
