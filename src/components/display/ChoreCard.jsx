import { useEffect, useState } from "react";
import { Button, Col, Row, Container, Card } from "react-bootstrap";
import { db } from "../../firebase.js";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import Chore from "./Chore.jsx";

function ChoreCard() {
  let [chores, setChores] = useState([]);
  let [userMap, setUserMap] = useState([]);
  let [rotation, setRotation] = useState([]);

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
        <Card.Body>
          {chores.map((chore) => {
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
