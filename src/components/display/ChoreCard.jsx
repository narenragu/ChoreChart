import { useEffect, useState, useRef } from "react";
import { Card } from "react-bootstrap";
import { db } from "../../firebase.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import Chore from "./Chore.jsx";

function ChoreCard(props) {
  const [chores, setChores] = useState([]);
  const [rotation, setRotation] = useState([]);
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

  async function fetchChores() {
    const chores = collection(db, "chores");
    let choreList = await getDocs(chores);
    choreList = choreList.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setChores(choreList);
  }

  useEffect(() => {
    async function fetchRotations() {
      const docRef = doc(db, "rotations", "rotations");
      const docSnap = await getDoc(docRef);

      setRotation(docSnap.data().rotation);
    }
    console.log("fetching chores");
    fetchChores();
    fetchRotations();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "chores"), (chores) => {
      chores = chores.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChores(chores);
    });

    return () => unsub();
  }, []);

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
                  userData={props.userData}
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
