import { useState, useEffect, useRef } from "react";
import "./App.css";
import ChoreCard from "./components/display/ChoreCard.jsx";
import CounterCard from "./components/display/CounterCard.jsx";
import NotesCard from "./components/display/NotesCard.jsx";
import ImageCard from "./components/display/ImageCard.jsx";

import { Col, Row, Container } from "react-bootstrap";
import { getDocs, collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase.js";

export default function App() {
  const [now, setNow] = useState(new Date());
  const [bottomBarHeight, setBottomBarHeight] = useState(0);
  const [userData, setUserData] = useState({});
  const [chores, setChores] = useState([]);
  const [counters, setCounters] = useState([]);
  const [notes, setNotes] = useState([]);
  const [images, setImages] = useState([]);
  const [rotation, setRotation] = useState([]);
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

  useEffect(() => {
    async function fetchAllData() {
      try {
        console.log("fetching all data");
        
        const userDataSnap = await getDocs(collection(db, "userData"));
        const userDataResult = {};
        userDataSnap.forEach((doc) => {
          userDataResult[doc.id] = doc.data();
        });
        setUserData(userDataResult);
        
        //fetches

        const choresSnap = await getDocs(collection(db, "chores"));
        const choresResult = choresSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChores(choresResult);

        const countersSnap = await getDocs(collection(db, "counters"));
        const countersResult = countersSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCounters(countersResult);

        const notesSnap = await getDocs(collection(db, "notes"));
        const notesResult = notesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(notesResult);

        const imagesSnap = await getDocs(collection(db, "images"));
        const imagesResult = imagesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setImages(imagesResult);

        const rotationDoc = await getDoc(doc(db, "rotations", "rotations"));
        if (rotationDoc.exists()) {
          setRotation(rotationDoc.data().rotation || []);
        }

        console.log("all data fetched");
      } catch (error) {
        console.error("error fetching data:", error);
      }
    }

    fetchAllData();
  }, []);

  useEffect(() => {
    // listeners
    const unsubscribers = [];

    try {
      const userDataUnsub = onSnapshot(collection(db, "userData"), (snapshot) => {
        const result = {};
        snapshot.forEach((doc) => {
          result[doc.id] = doc.data();
        });
        setUserData(result);
      });
      unsubscribers.push(userDataUnsub);


      
      const choresUnsub = onSnapshot(collection(db, "chores"), (snapshot) => {
        const result = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChores(result);
      });
      unsubscribers.push(choresUnsub);

      
      const countersUnsub = onSnapshot(collection(db, "counters"), (snapshot) => {
        const result = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCounters(result);
      });
      unsubscribers.push(countersUnsub);

      

      const notesUnsub = onSnapshot(collection(db, "notes"), (snapshot) => {
        const result = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(result);
      });
      unsubscribers.push(notesUnsub);

      

      const imagesUnsub = onSnapshot(collection(db, "images"), (snapshot) => {
        const result = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setImages(result);
      });
      unsubscribers.push(imagesUnsub);

      

      const rotationUnsub = onSnapshot(doc(db, "rotations", "rotations"), (snapshot) => {
        if (snapshot.exists()) {
          setRotation(snapshot.data().rotation || []);
        }
      });
      unsubscribers.push(rotationUnsub);

    } catch (error) {
      console.error("failed setup listeners:", error);
    }

    
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
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
          <ChoreCard 
            userData={userData} 
            chores={chores} 
            rotation={rotation}
          />
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
            <NotesCard 
              userData={userData} 
              notes={notes}
            />
          </div>
          <div
            style={{
              flex: 1,
              padding: "1rem",
              display: "flex",
              gap: "1rem",
              overflow: "hidden",
            }}
          >
            <div style={{ flex: 1, overflowY: "auto" }}>
              <CounterCard 
                userData={userData} 
                counters={counters}
              />
            </div>
            <div style={{ flex: 1, overflowY: "hidden" }}>
              <ImageCard images={images} />
            </div>
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
