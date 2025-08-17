import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import Chore from "../display/Chore";
import { Button } from "react-bootstrap";

export default function ChoreTab(props) {
  const [chores, setChores] = useState([]);
  const [rotation, setRotation] = useState([]);
  const [filter, setFilter] = useState(false);

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
      <div className="d-flex justify-content-center">
        <Button
          variant="secondary"
          onClick={() => {
            setFilter((current) => {
              return !current;
            });
          }}
        >
          {filter ? "View All Chores" : "View My Chores"}
        </Button>
      </div>
      {(filter
        ? chores.filter(
            (chore) => rotation[chore.assigneeIndex] == props.user.uid
          )
        : chores
      )
        .sort((a, b) => a.dueDate - b.dueDate)
        .map((chore) => {
          return (
            <>
              <hr></hr>
              <Chore
                {...chore}
                rotation={rotation}
                userData={props.userData}
                key={chore.name}
                user={props.user}
              ></Chore>
            </>
          );
        })}
    </>
  );
}
