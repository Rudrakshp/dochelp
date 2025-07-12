// src/components/PatientForm.jsx
import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function PatientForm() {
  const [form, setForm] = useState({ name: "", age: "", diagnosis: "", medicines: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.age || !form.diagnosis || !form.medicines) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "patients"), form);
      setForm({ name: "", age: "", diagnosis: "", medicines: "" });
    } catch (error) {
      alert("Failed to save patient: " + error.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
      <input placeholder="Diagnosis" value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />
      <input placeholder="Medicines" value={form.medicines} onChange={(e) => setForm({ ...form, medicines: e.target.value })} />
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "➕ Add Patient"}
      </button>
    </form>
  );
}
