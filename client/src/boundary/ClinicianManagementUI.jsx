// ClinicianManagementUI.jsx

import React, { useState, useEffect } from 'react';
import CustomTable from '../components/CustomTable';
import './ClinicianManagementUI.css';
import Navbar from '../components/Navbar';

function ClinicianManagementUI() {
  const [patients, setPatients] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newNoteText, setNewNoteText] = useState('');
  const [isPatientVisible, setIsPatientVisible] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);

  // 1️⃣ View all patients
  const fetchPatients = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/clinician/patients',{
        headers: { 'x-user-email': localStorage.getItem('email') }
      });
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
        `http://localhost:5000/api/clinician/patients/${patient.patient_id}/notes`,{
        headers: { 'x-user-email': localStorage.getItem('email') }
      }
      );
      const data = await res.json();
      setNotes(data);
      setSelectedPatient(patient);
      setShowNotesModal(true);
    } catch (err) {
      console.error('Failed to fetch patient notes:', err);
    }
  };

  // 3️⃣ Add clinician note
  const addClinicianNote = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/clinician/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-email': localStorage.getItem('email') },
        body: JSON.stringify({
          patient_id: selectedPatient.patient_id,
          note_text: newNoteText,
          is_patient_visible: isPatientVisible
        })
      });

      const data = await res.json();
      if (data.success) {
        alert('Note added successfully');
        setShowAddModal(false);
        setNewNoteText('');
        setIsPatientVisible(false);
        fetchPatientNotes(selectedPatient);
      } else {
        alert('Failed to add note');
      }
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  // 4️⃣ Update clinician note
  const updateClinicianNote = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/clinician/notes/${selectedNote.note_id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-user-email': localStorage.getItem('email') },
          body: JSON.stringify({
            note_text: selectedNote.note_text,
            is_patient_visible: selectedNote.is_patient_visible
          })
        }
      );

      const data = await res.json();
      if (data.success) {
        alert('Note updated successfully');
        setShowEditModal(false);
        fetchPatientNotes(selectedPatient);
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
    <div className="container" style={{ marginTop: '80px' }}>
      <Navbar />
      <h2>Clinician Dashboard</h2>

      {/* Patients table */}
      <CustomTable
        columns={[
          { id: 'patient_id', label: 'Patient ID' },
          { id: 'patient_name', label: 'Patient Name' }
        ]}
        data={patients}
        onEdit={fetchPatientNotes} // pencil → view notes
      />

      {/* Patient Notes Modal */}
      {showNotesModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Patient Notes – {selectedPatient.patient_name}</h3>
              <button className="close-button" onClick={() => setShowNotesModal(false)}>×</button>
            </div>

            <button
              className="btn btn-create"
              onClick={() => setShowAddModal(true)}
            >
              Add Clinician Note
            </button>

            <CustomTable
              columns={[
                { id: 'note_type', label: 'Type' },
                { id: 'note_time', label: 'Date' }
              ]}
              data={notes}
              onEdit={(note) => {
                if (note.note_type === 'clinician') {
                  setSelectedNote(note);
                  setShowEditModal(true);
                } else {
                  setSelectedNote(note);
                  setShowViewModal(true);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Add Clinician Note Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Clinician Note</h3>
              <button className="close-button" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <div className="form-group">
              <label>Note</label>
              <textarea
                className="form-control"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={isPatientVisible}
                  onChange={(e) => setIsPatientVisible(e.target.checked)}
                />
                {' '}Visible to patient
              </label>
            </div>

            <div className="modal-footer">
              <button className="btn btn-cancel" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn btn-create" onClick={addClinicianNote}>
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Clinician Note Modal */}
      {showEditModal && selectedNote && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Clinician Note</h3>
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

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={selectedNote.is_patient_visible}
                  onChange={(e) =>
                    setSelectedNote({
                      ...selectedNote,
                      is_patient_visible: e.target.checked
                    })
                  }
                />
                {' '}Visible to patient
              </label>
            </div>

            <div className="modal-footer">
              <button className="btn btn-cancel" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn btn-create" onClick={updateClinicianNote}>
                Update Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View-Only Modal for Clinician/AI Notes */}
      {showViewModal && selectedNote && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>View Note ({selectedNote.note_type})</h3>
              <button className="close-button" onClick={() => setShowViewModal(false)}>×</button>
            </div>

            <div className="form-group">
              <label>Note</label>
              <textarea
                className="form-control"
                value={selectedNote.note_text}
                disabled  // ✅ Read-only
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-cancel" onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClinicianManagementUI;
