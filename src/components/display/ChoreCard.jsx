import { useEffect, useState, useRef } from "react";
import { Button, Col, Row, Container, Card } from "react-bootstrap";
import { db } from "../../firebase.js";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import Chore from "./Chore.jsx";

function ChoreCard() {
  const [chores, setChores] = useState([]);
  const [userMap, setUserMap] = useState([]);
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
        container.scrollTop + container.clientHeight >=
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

  async function fetchChores() {
    const chores = collection(db, "chores");
    let choreList = await getDocs(chores);
    choreList = choreList.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(choreList);
    setChores(choreList);
  }

  useEffect(() => {
    async function fetchRotations() {
      const docRef = doc(db, "rotations", "rotations");
      const docSnap = await getDoc(docRef);

      setUserMap(docSnap.data().userMap);
      setRotation(docSnap.data().defaultRotation);
    }

    fetchChores();
    fetchRotations();
  }, []);

  return (
    <>
      <Card className="h-100 w-100">
        <Card.Header>
          <h3>Chores</h3>
        </Card.Header>
        <Card.Body style={{ overflowY: "auto" }} ref={scrollRef}>
          {chores
            .sort((a, b) => a.dueDate - b.dueDate)
            .map((chore) => {
              return (
                <Chore {...chore} userMap={userMap} key={chore.name}></Chore>
              );
            })}
        </Card.Body>
      </Card>
    </>
  );
}

export default ChoreCard;
