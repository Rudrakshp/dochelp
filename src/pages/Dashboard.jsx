// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import PatientForm from "../components/PatientForm";
import PatientList from "../components/PatientList";
import "../App.css";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "patients"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients(data);
    });

    return () => unsub();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">🩺 Doctor Dashboard</h1>

      <div className="dashboard-flex">
        <div className="form-container">
          <PatientForm />
        </div>
        <div className="patient-list-container">
          <PatientList patients={patients} setPatients={setPatients} />
        </div>
      </div>
    </div>
  );
}
