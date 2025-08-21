import { useEffect, useState, useRef } from "react";
import { Button, Col, Row, Container, Card } from "react-bootstrap";
import Note from "./Note.jsx";

function NotesCard(props) {
  const { userData, notes = [] } = props;
  const scrollRef = useRef();
  const [scrollDirection, setScrollDirection] = useState();
  const pauseTime = 2000;
  const speed = 1;

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let scrolling = true;

    const scrollStep = () => {
      if (!scrolling) return;

      container.scrollTop += scrollDirection * speed;

      // If reached bottom
      if (
        container.scrollTop + container.clientHeight + 2 >=
        container.scrollHeight
      ) {
        scrolling = false;
        setTimeout(() => {
          setScrollDirection(-1);
          scrolling = true;
        }, pauseTime);
      }

      // If reached top
      if (container.scrollTop <= 0) {
        scrolling = false;
        setTimeout(() => {
          setScrollDirection(1);
          scrolling = true;
        }, pauseTime);
      }
    };

    const intervalId = setInterval(scrollStep, 20);
    return () => clearInterval(intervalId);
  }, [scrollDirection]);

  return (
    <>
      <Card className="h-100 w-100 ">
        <Card.Header style={{ background: "#FFA6001F" }}>
          <h3>Notes</h3>
        </Card.Header>
        <Card.Body
          style={{ overflowY: "clip", background: "#FFA6000F" }}
          className="p-2"
          ref={scrollRef}
        >
          {notes
            .sort((a, b) => b.datePosted - a.datePosted)
            .map((note) => {
              return (
                <Note
                  {...note}
                  userData={userData}
                  key={note.datePosted}
                ></Note>
              );
            })}
        </Card.Body>
      </Card>
    </>
  );
}

export default NotesCard;
