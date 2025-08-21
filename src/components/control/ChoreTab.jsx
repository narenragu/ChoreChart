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

  useEffect(() => {
    async function fetchRotations() {
      const docRef = doc(db, "rotations", "rotations");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setRotation(docSnap.data().rotation);
      }
    }

    fetchRotations();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "chores"), (snapshot) => {
      const choresList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChores(choresList);
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
        .sort(
          (a, b) =>
            new Date(`${a.dueDate}T00:00:00`) -
            new Date(`${b.dueDate}T00:00:00`)
        )
        .map((chore) => {
          return (
            <div key={chore.name}>
              <hr></hr>
              <Chore
                {...chore}
                rotation={rotation}
                userData={props.userData}
                user={props.user}
              ></Chore>
            </div>
          );
        })}
    </>
  );
}
