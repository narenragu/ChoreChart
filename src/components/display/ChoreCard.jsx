import { useEffect, useState, useRef } from "react";
import { Button, Col, Row, Container, Card } from "react-bootstrap";
import Chore from "./Chore.jsx";

function ChoreCard(props) {
  const { userData, chores = [], rotation = [] } = props;
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
      <Card className="h-100 w-100">
        <Card.Header>
          <h3>Chores</h3>
        </Card.Header>
        <Card.Body
          style={{ overflowX: "clip", overflowY: "auto" }}
          ref={scrollRef}
          className="p-2"
        >
          {chores
            .sort(
              (a, b) =>
                new Date(`${a.dueDate}T00:00:00`) -
                new Date(`${b.dueDate}T00:00:00`)
            )
            .map((chore) => {
              return (
                <Chore
                  {...chore}
                  rotation={rotation}
                  userData={userData}
                  key={chore.name}
                ></Chore>
              );
            })}
        </Card.Body>
      </Card>
    </>
  );
}

export default ChoreCard;
