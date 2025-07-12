// src/components/PatientList.jsx
import React from "react";
import { db } from "../firebase";
import { deleteDoc, updateDoc, doc } from "firebase/firestore";
import jsPDF from "jspdf";

const PatientList = ({ patients, setPatients }) => {
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "patients", id));
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleEdit = async (patient) => {
    const updatedName = prompt("Update Name", patient.name);
    const updatedAge = prompt("Update Age", patient.age);
    const updatedDiagnosis = prompt("Update Diagnosis", patient.diagnosis);
    const updatedMedicines = prompt("Update Medicines", patient.medicines);

    const updated = {
      name: updatedName || patient.name,
      age: updatedAge || patient.age,
      diagnosis: updatedDiagnosis || patient.diagnosis,
      medicines: updatedMedicines || patient.medicines,
    };

    try {
      await updateDoc(doc(db, "patients", patient.id), updated);
      setPatients((prev) =>
        prev.map((p) => (p.id === patient.id ? { ...p, ...updated } : p))
      );
    } catch (err) {
      alert("Failed to update patient: " + err.message);
    }
  };

  const exportPDF = (patient) => {
    try {
      const pdfDoc = new jsPDF();
      pdfDoc.text(`Name: ${patient.name}`, 10, 10);
      pdfDoc.text(`Age: ${patient.age}`, 10, 20);
      pdfDoc.text(`Diagnosis: ${patient.diagnosis}`, 10, 30);
      pdfDoc.text(`Medicines: ${patient.medicines}`, 10, 40);
      pdfDoc.save(`${patient.name}_record.pdf`);
    } catch (err) {
      alert("Failed to export PDF: " + err.message);
    }
  };

  return (
    <div className="patient-list">
      <h3>Saved Patient Records</h3>
      {patients.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div className="patient-grid">
          {patients.map((patient) => (
            <div key={patient.id} className="patient-card">
              <p><strong>Name:</strong> {patient.name}</p>
              <p><strong>Age:</strong> {patient.age}</p>
              <p><strong>Diagnosis:</strong> {patient.diagnosis}</p>
              <p><strong>Medicines:</strong> {patient.medicines}</p>

              <div className="actions">
                <button onClick={() => handleEdit(patient)}>Edit</button>
                <button className="delete" onClick={() => handleDelete(patient.id)}>Delete</button>
                <button className="export" onClick={() => exportPDF(patient)}>Export PDF</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientList;
