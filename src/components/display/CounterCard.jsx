import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import {
  Button,
  Col,
  Row,
  Container,
  Card,
  Carousel,
  Badge,
} from "react-bootstrap";
import { db } from "../../firebase";
import Counter from "./Counter";

function CounterCard(props) {
  const [counters, setCounters] = useState([]);

  useEffect(() => {
    async function fetchCounters() {
      const counters = collection(db, "counters");
      let countersList = await getDocs(counters);
      countersList = countersList.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCounters(countersList);
    }

    fetchCounters();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "counters"), (counters) => {
      counters = counters.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCounters(counters);
    });

    return () => unsub();
  }, []);

  return (
    <>
      <Card className="h-100 w-100">
        <Card.Header>
          <h3>Counters</h3>
        </Card.Header>
        <Card.Body>
          <Carousel controls={false}>
            {counters.map((counter) => (
              <Carousel.Item>
                <Counter {...counter} userData={props.userData} />
              </Carousel.Item>
            ))}
          </Carousel>
        </Card.Body>
      </Card>
    </>
  );
}

export default CounterCard;
