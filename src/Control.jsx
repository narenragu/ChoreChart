import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

import Login from "./components/control/Login.jsx";
import { Tabs, Tab, Navbar, Container } from "react-bootstrap";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "./firebase.js";
import AccountTab from "./components/control/AccountTab.jsx";
import ChoreTab from "./components/control/ChoreTab.jsx";
import NotesTab from "./components/control/NotesTab.jsx";
import ImageTab from "./components/control/ImageTab.jsx";
import CounterTab from "./components/control/CounterTab.jsx";

export default function Control() {
  const [user, setUser] = useState("loading");
  const [userData, setUserData] = useState({});
  const [tab, setTab] = useState("chores");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      fetchUserData();
    });

    return () => unsubscribe();
  }, []);

  async function fetchUserData() {
    const docSnap = await getDocs(collection(db, "userData"));

    const result = {};
    docSnap.forEach((doc) => {
      result[doc.id] = doc.data();
    });
    setUserData(result);
  }

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "userData"), (newUserData) => {
      const result = {};
      newUserData.forEach((doc) => {
        result[doc.id] = doc.data();
      });
      setUserData(result);
    });

    return () => unsub();
  }, []);

  return (
    <>
      {user ? (
        user == "loading" ? (
          ""
        ) : (
          <>
            <Navbar className="bg-body-tertiary">
              <Container>
                <Navbar.Brand>Chore Chart Control</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                  <Navbar.Text
                    onClick={() => {
                      setTab("account");
                    }}
                  >
                    Signed in as: <u>{userData[user.uid]?.name}</u>
                  </Navbar.Text>
                </Navbar.Collapse>
              </Container>
            </Navbar>
            <Container className="py-2">
              <Tabs
                id="controlled-tab-example"
                activeKey={tab}
                onSelect={(t) => setTab(t)}
                className="mb-3"
              >
                {userData[user.uid]?.isRoommate
                  ? [
                      <Tab eventKey="chores" title="Chores" key="chores">
                        <ChoreTab userData={userData} user={user} />
                      </Tab>,
                      <Tab eventKey="notes" title="Notes" key="notes">
                        <NotesTab userData={userData} user={user} />
                      </Tab>,
                      <Tab eventKey="history" title="History" key="history">
                        History Tab Placeholder
                      </Tab>,
                    ]
                  : ""}
                <Tab eventKey="counters" title="Counters" key="counters">
                  <CounterTab userData={userData} />
                </Tab>

                <Tab eventKey="image" title="Image">
                  <ImageTab />
                </Tab>
                <Tab eventKey="account" title="Account">
                  <AccountTab user={user} />
                </Tab>
              </Tabs>
            </Container>
          </>
        )
      ) : (
        <Login></Login>
      )}
    </>
  );
}

function Home(props) {
  return <>{<p>menu</p>}</>;
}
