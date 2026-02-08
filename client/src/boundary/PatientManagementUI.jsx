// PatientManagementUI.jsx

import React, { useState, useEffect } from 'react';
import CustomTable from '../components/CustomTable'; 
// reuse table component for pencil icon
import './ClinicianManagementUI.css'; // reuse existing styles

function PatientManagementUI() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch patient-visible notes
  const viewMyNotes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/patient/notes');
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error('Failed to fetch patient notes:', err);
    }
  };

  useEffect(() => {
    viewMyNotes();
  }, []);

  const openDetailsModal = (note) => {
    setSelectedNote(note);
    setShowDetailsModal(true);
  };

  return (
    <div className="container">
      <h2>My Medical Notes</h2>

      <CustomTable
        columns={[
          { id: 'note_type', label: 'Note Type' },
          { id: 'note_time', label: 'Date' }
        ]}
        data={notes}
        onEdit={openDetailsModal}   // pencil icon = view
        showActions={true}          // keep pencil icon
      />

      {/* Note Details Modal (READ-ONLY) */}
      {showDetailsModal && selectedNote && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Note Details</h3>
              <button
                className="close-button"
                onClick={() => setShowDetailsModal(false)}
              >
                ×
              </button>
            </div>

            <div className="form-group">
              <strong>Note Type:</strong> {selectedNote.note_type}
            </div>

            <div className="form-group">
              <strong>Date:</strong> {new Date(selectedNote.note_time).toLocaleString()}
            </div>

            <div className="form-group">
              <strong>Note:</strong>
              <p>{selectedNote.note_text}</p>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-cancel"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientManagementUI;
