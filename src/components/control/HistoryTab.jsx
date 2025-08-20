import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Badge, Table } from "react-bootstrap";
import { db } from "../../firebase";

export default function HistoryTab(props) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "history"), (snapshot) => {
      const historyList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(historyList);
    });

    return () => unsub();
  }, []);

  return (
    <>
      <h3>Chore History</h3>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Name</th>
            <th>Chore</th>
            <th>Date Completed</th>
          </tr>
        </thead>
        <tbody>
          {history
            .sort((a, b) => b.date - a.date)
            .map((entry) => (
              <tr key={entry.id}>
                <td>{props.userData[entry.userID].name}</td>
                <td>
                  <Badge style={{ background: entry.data.color + "4F" }} bg="">
                    {entry.data.name}
                  </Badge>
                </td>
                <td>
                  {new Date(entry.date.seconds * 1000).toDateString() +
                    " " +
                    new Date(entry.date.seconds * 1000).toLocaleTimeString()}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
}
