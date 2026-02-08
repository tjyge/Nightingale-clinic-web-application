// StaffManagementUI.jsx

import React, { useState, useEffect } from 'react';
import CustomTable from '../components/CustomTable';
import './StaffManagementUI.css';

function StaffManagementUI() {
  const [patients, setPatients] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // 1️⃣ View all patients
  const fetchPatients = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/staff/patients');
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.error('Failed to fetch patients:', err);
    }
  };

  // 2️⃣ View patient notes
  const fetchPatientNotes = async (patient) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/staff/patients/${patient.patient_id}/notes`
      );
      const data = await res.json();
      setNotes(data);
      setSelectedPatient(patient);
      setShowNotesModal(true);
    } catch (err) {
      console.error('Failed to fetch patient notes:', err);
    }
  };

  // 3️⃣ Update staff note
  const updateStaffNote = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/staff/notes/${selectedNote.note_id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' ,'x-user-email': localStorage.getItem('email')},
          body: JSON.stringify({ note_text: selectedNote.note_text })
        }
      );

      const data = await res.json();
      if (data.success) {
        alert('Note updated successfully');
        setShowEditModal(false);
        fetchPatientNotes(selectedPatient); // refresh notes
      } else {
        alert('Failed to update note');
      }
    } catch (err) {
      console.error('Failed to update note:', err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="container">
      <h2>Staff Dashboard</h2>

      {/* Patients table */}
      <CustomTable
        columns={[
          { id: 'patient_id', label: 'Patient ID' },
          { id: 'patient_name', label: 'Patient Name' }
        ]}
        data={patients}
        onEdit={fetchPatientNotes}   // pencil = view notes
      />

      {/* Patient Notes Modal */}
      {showNotesModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Patient Notes – {selectedPatient.patient_name}</h3>
              <button className="close-button" onClick={() => setShowNotesModal(false)}>×</button>
            </div>

            <CustomTable
              columns={[
                { id: 'note_type', label: 'Type' },
                { id: 'note_time', label: 'Date' }
              ]}
              data={notes}
              onEdit={(note) => {
                if (note.note_type === 'staff') {
                  setSelectedNote(note);
                  setShowEditModal(true);
                } else {
                  alert('You can only edit staff notes.');
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Edit Staff Note Modal */}
      {showEditModal && selectedNote && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Staff Note</h3>
              <button className="close-button" onClick={() => setShowEditModal(false)}>×</button>
            </div>

            <div className="form-group">
              <label>Note</label>
              <textarea
                className="form-control"
                value={selectedNote.note_text}
                onChange={(e) =>
                  setSelectedNote({ ...selectedNote, note_text: e.target.value })
                }
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-cancel" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn btn-create" onClick={updateStaffNote}>
                Update Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffManagementUI;
