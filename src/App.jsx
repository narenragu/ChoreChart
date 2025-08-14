import { useState, useEffect, useRef } from "react";
import "./App.css";
import ChoreCard from "./components/display/ChoreCard.jsx";
import TodoCard from "./components/display/TodoCard.jsx";
import NotesCard from "./components/display/NotesCard.jsx";

import { Col, Row, Container } from "react-bootstrap";

export default function App() {
  const [now, setNow] = useState(new Date());
  const [bottomBarHeight, setBottomBarHeight] = useState(0);
  const bottomBarRef = useRef(null);

  // Clock updater
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Measure bottom bar height
  useEffect(() => {
    const updateHeight = () => {
      if (bottomBarRef.current) {
        setBottomBarHeight(bottomBarRef.current.offsetHeight);
      }
    };

    updateHeight(); // initial measure
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <Container
      fluid
      className="d-flex flex-column"
      style={{
        height: "100vh",
        padding: 0,
        overflow: "hidden", // no outer scroll
      }}
    >
      {/* Main content area */}
      <Row
        style={{
          flex: 1,
          margin: 0,
          height: `calc(100vh - ${bottomBarHeight}px)`, // dynamic subtraction
        }}
      >
        {/* Left panel */}
        <Col
          md={6}
          style={{
            padding: "1rem",
            height: "100%",
          }}
        >
          <ChoreCard />
        </Col>

        {/* Right side split vertically */}
        <Col
          md={6}
          className="d-flex flex-column"
          style={{
            padding: 0,
            height: "100%",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "1rem",
              overflowY: "auto",
            }}
          >
            <TodoCard />
          </div>
          <div
            style={{
              flex: 1,
              padding: "1rem",
              overflowY: "auto",
            }}
          >
            <NotesCard />
          </div>
        </Col>
      </Row>

      {/* Bottom bar */}
      <Row
        ref={bottomBarRef}
        className="align-items-center px-3 rounded"
        style={{
          background: "#0000001F",
          flexShrink: 0,
        }}
      >
        <Col>
          <h1 className="text-center" style={{ margin: 0 }}>
            {now.toDateString()} {now.toLocaleTimeString()}
          </h1>
        </Col>
      </Row>
    </Container>
  );
}
