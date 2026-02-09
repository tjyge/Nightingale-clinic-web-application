"""
test_rbac_scope.py

Tests for Role-Based Access Control (RBAC) scope in the clinic application.

This test suite verifies:
1. Staff cannot write or edit clinician notes
2. Clinicians cannot write or edit staff notes
3. Patients cannot access internal comments (is_patient_visible = false)
4. Patients cannot access raw AI-scribed notes that are not patient-visible
"""

import pytest
import requests

# Base URL for the API
BASE_URL = "http://localhost:5000/api"

# Test credentials
STAFF_EMAIL = "staff1@nightingale.com"
CLINICIAN_EMAIL = "clinician1@nightingale.com"
PATIENT_EMAIL = "patient1@nightingale.com"

# Test data
TEST_PATIENT_ID = "PAT_001"
CLINIC_ID = "CLINIC_001"


class TestStaffCannotEditClinicianNotes:
    """Test that staff cannot write or edit clinician notes"""

    def test_staff_cannot_update_clinician_note(self):
        """
        Assert that staff cannot edit a clinician's note
        """
        # Step 1: Get all notes for patient as staff
        response = requests.get(
            f"{BASE_URL}/staff/patients/{TEST_PATIENT_ID}/notes",
            headers={"x-user-email": STAFF_EMAIL}
        )
        assert response.status_code == 200
        notes = response.json()

        # Find a clinician note
        clinician_note = None
        for note in notes:
            if note['note_type'] == 'clinician':
                clinician_note = note
                break

        assert clinician_note is not None, "No clinician note found in test data"

        # Step 2: Try to update the clinician note as staff
        original_text = clinician_note['note_text']
        updated_text = "STAFF TRYING TO MODIFY CLINICIAN NOTE - THIS SHOULD FAIL"

        response = requests.put(
            f"{BASE_URL}/staff/notes/{clinician_note['note_id']}",
            headers={
                "x-user-email": STAFF_EMAIL,
                "Content-Type": "application/json"
            },
            json={"note_text": updated_text}
        )

        # Step 3: Assert the update failed (success = false)
        assert response.status_code == 200
        result = response.json()
        assert result['success'] is False, "Staff should not be able to edit clinician notes"

        # Step 4: Verify the note was NOT actually updated
        response = requests.get(
            f"{BASE_URL}/staff/patients/{TEST_PATIENT_ID}/notes",
            headers={"x-user-email": STAFF_EMAIL}
        )
        notes_after = response.json()
        
        clinician_note_after = None
        for note in notes_after:
            if note['note_id'] == clinician_note['note_id']:
                clinician_note_after = note
                break

        assert clinician_note_after['note_text'] == original_text, \
            "Clinician note text should remain unchanged after staff update attempt"

    def test_staff_cannot_update_ai_note(self):
        """
        Assert that staff cannot edit an AI note
        """
        # Step 1: Get all notes for patient as staff
        response = requests.get(
            f"{BASE_URL}/staff/patients/{TEST_PATIENT_ID}/notes",
            headers={"x-user-email": STAFF_EMAIL}
        )
        assert response.status_code == 200
        notes = response.json()

        # Find an AI note
        ai_note = None
        for note in notes:
            if note['note_type'] == 'ai':
                ai_note = note
                break

        assert ai_note is not None, "No AI note found in test data"

        # Step 2: Try to update the AI note as staff
        original_text = ai_note['note_text']
        updated_text = "STAFF TRYING TO MODIFY AI NOTE - THIS SHOULD FAIL"

        response = requests.put(
            f"{BASE_URL}/staff/notes/{ai_note['note_id']}",
            headers={
                "x-user-email": STAFF_EMAIL,
                "Content-Type": "application/json"
            },
            json={"note_text": updated_text}
        )

        # Step 3: Assert the update failed
        assert response.status_code == 200
        result = response.json()
        assert result['success'] is False, "Staff should not be able to edit AI notes"

    def test_staff_can_update_own_note(self):
        """
        Assert that staff CAN edit their own staff notes (positive control)
        """
        # Step 1: Get all notes for patient as staff
        response = requests.get(
            f"{BASE_URL}/staff/patients/{TEST_PATIENT_ID}/notes",
            headers={"x-user-email": STAFF_EMAIL}
        )
        assert response.status_code == 200
        notes = response.json()

        # Find a staff note
        staff_note = None
        for note in notes:
            if note['note_type'] == 'staff':
                staff_note = note
                break

        assert staff_note is not None, "No staff note found in test data"

        # Step 2: Update the staff note
        updated_text = "Updated by staff - this should succeed"

        response = requests.put(
            f"{BASE_URL}/staff/notes/{staff_note['note_id']}",
            headers={
                "x-user-email": STAFF_EMAIL,
                "Content-Type": "application/json"
            },
            json={"note_text": updated_text}
        )

        # Step 3: Assert the update succeeded
        assert response.status_code == 200
        result = response.json()
        assert result['success'] is True, "Staff should be able to edit their own notes"

        # Step 4: Verify the note was actually updated
        response = requests.get(
            f"{BASE_URL}/staff/patients/{TEST_PATIENT_ID}/notes",
            headers={"x-user-email": STAFF_EMAIL}
        )
        notes_after = response.json()
        
        staff_note_after = None
        for note in notes_after:
            if note['note_id'] == staff_note['note_id']:
                staff_note_after = note
                break

        assert staff_note_after['note_text'] == updated_text, \
            "Staff note text should be updated successfully"


class TestClinicianCannotEditStaffNotes:
    """Test that clinicians cannot write or edit staff notes"""

    def test_clinician_cannot_update_staff_note(self):
        """
        Assert that clinician cannot edit a staff note
        """
        # Step 1: Get all notes for patient as clinician
        response = requests.get(
            f"{BASE_URL}/clinician/patients/{TEST_PATIENT_ID}/notes",
            headers={"x-user-email": CLINICIAN_EMAIL}
        )
        assert response.status_code == 200
        notes = response.json()

        # Find a staff note
        staff_note = None
        for note in notes:
            if note['note_type'] == 'staff':
                staff_note = note
                break

        assert staff_note is not None, "No staff note found in test data"

        # Step 2: Try to update the staff note as clinician
        original_text = staff_note['note_text']
        updated_text = "CLINICIAN TRYING TO MODIFY STAFF NOTE - THIS SHOULD FAIL"

        response = requests.put(
            f"{BASE_URL}/clinician/notes/{staff_note['note_id']}",
            headers={
                "x-user-email": CLINICIAN_EMAIL,
                "Content-Type": "application/json"
            },
            json={
                "note_text": updated_text,
                "is_patient_visible": False
            }
        )

        # Step 3: Assert the update failed
        assert response.status_code == 200
        result = response.json()
        assert result['success'] is False, "Clinician should not be able to edit staff notes"

        # Step 4: Verify the note was NOT actually updated
        response = requests.get(
            f"{BASE_URL}/clinician/patients/{TEST_PATIENT_ID}/notes",
            headers={"x-user-email": CLINICIAN_EMAIL}
        )
        notes_after = response.json()
        
        staff_note_after = None
        for note in notes_after:
            if note['note_id'] == staff_note['note_id']:
                staff_note_after = note
                break

        assert staff_note_after['note_text'] == original_text, \
            "Staff note text should remain unchanged after clinician update attempt"

    def test_clinician_cannot_update_ai_note(self):
        """
        Assert that clinician cannot edit an AI note
        """
        # Step 1: Get all notes for patient as clinician
        response = requests.get(
            f"{BASE_URL}/clinician/patients/{TEST_PATIENT_ID}/notes",
            headers={"x-user-email": CLINICIAN_EMAIL}
        )
        assert response.status_code == 200
        notes = response.json()

        # Find an AI note
        ai_note = None
        for note in notes:
            if note['note_type'] == 'ai':
                ai_note = note
                break

        assert ai_note is not None, "No AI note found in test data"

        # Step 2: Try to update the AI note as clinician
        original_text = ai_note['note_text']
        updated_text = "CLINICIAN TRYING TO MODIFY AI NOTE - THIS SHOULD FAIL"

        response = requests.put(
            f"{BASE_URL}/clinician/notes/{ai_note['note_id']}",
            headers={
                "x-user-email": CLINICIAN_EMAIL,
                "Content-Type": "application/json"
            },
            json={
                "note_text": updated_text,
                "is_patient_visible": True
            }
        )

        # Step 3: Assert the update failed
        assert response.status_code == 200
        result = response.json()
        assert result['success'] is False, "Clinician should not be able to edit AI notes"

    def test_clinician_can_update_own_note(self):
        """
        Assert that clinician CAN edit their own clinician notes (positive control)
        """
        # Step 1: Get all notes for patient as clinician
        response = requests.get(
            f"{BASE_URL}/clinician/patients/{TEST_PATIENT_ID}/notes",
            headers={"x-user-email": CLINICIAN_EMAIL}
        )
        assert response.status_code == 200
        notes = response.json()

        # Find a clinician note
        clinician_note = None
        for note in notes:
            if note['note_type'] == 'clinician':
                clinician_note = note
                break

        assert clinician_note is not None, "No clinician note found in test data"

        # Step 2: Update the clinician note
        updated_text = "Updated by clinician - this should succeed"

        response = requests.put(
            f"{BASE_URL}/clinician/notes/{clinician_note['note_id']}",
            headers={
                "x-user-email": CLINICIAN_EMAIL,
                "Content-Type": "application/json"
            },
            json={
                "note_text": updated_text,
                "is_patient_visible": clinician_note['is_patient_visible']
            }
        )

        # Step 3: Assert the update succeeded
        assert response.status_code == 200
        result = response.json()
        assert result['success'] is True, "Clinician should be able to edit their own notes"

        # Step 4: Verify the note was actually updated
        response = requests.get(
            f"{BASE_URL}/clinician/patients/{TEST_PATIENT_ID}/notes",
            headers={"x-user-email": CLINICIAN_EMAIL}
        )
        notes_after = response.json()
        
        clinician_note_after = None
        for note in notes_after:
            if note['note_id'] == clinician_note['note_id']:
                clinician_note_after = note
                break

        assert clinician_note_after['note_text'] == updated_text, \
            "Clinician note text should be updated successfully"


class TestPatientCannotAccessInternalNotes:
    """Test that patients cannot access internal comments or non-visible notes"""

    def test_patient_can_only_see_patient_visible_notes(self):
        """
        Assert that a patient can only see notes where is_patient_visible = true
        """
        # Step 1: Get notes as patient
        response = requests.get(
            f"{BASE_URL}/patient/notes",
            headers={"x-user-email": PATIENT_EMAIL}
        )
        assert response.status_code == 200
        patient_notes = response.json()

        # Step 2: Assert all returned notes have is_patient_visible = true
        # Note: The patient API doesn't return is_patient_visible in the response,
        # but we can verify by checking note types
        for note in patient_notes:
            # Patient should primarily see AI notes
            # Staff and clinician notes should only appear if is_patient_visible = true
            assert note['note_type'] in ['ai', 'staff', 'clinician'], \
                f"Unexpected note type: {note['note_type']}"

        # Step 3: Get all notes as staff to compare
        response = requests.get(
            f"{BASE_URL}/staff/patients/{TEST_PATIENT_ID}/notes",
            headers={"x-user-email": STAFF_EMAIL}
        )
        assert response.status_code == 200
        all_notes = response.json()

        # Step 4: Count internal notes (is_patient_visible = false)
        internal_notes_count = sum(1 for note in all_notes if not note['is_patient_visible'])
        
        # Step 5: Assert patient sees fewer notes than total notes
        assert len(patient_notes) < len(all_notes), \
            "Patient should see fewer notes than the total available (internal notes should be hidden)"
        
        # Step 6: Assert patient cannot see internal notes
        patient_note_ids = {note['note_id'] for note in patient_notes}
        for note in all_notes:
            if not note['is_patient_visible']:
                assert note['note_id'] not in patient_note_ids, \
                    f"Patient should not see internal note {note['note_id']}"

    def test_patient_cannot_see_internal_staff_notes(self):
        """
        Assert that patient cannot access internal staff comments
        """
        # Get all notes as staff
        response = requests.get(
            f"{BASE_URL}/staff/patients/{TEST_PATIENT_ID}/notes",
            headers={"x-user-email": STAFF_EMAIL}
        )
        assert response.status_code == 200
        all_notes = response.json()

        # Find internal staff notes (is_patient_visible = false)
        internal_staff_notes = [
            note for note in all_notes 
            if note['note_type'] == 'staff' and not note['is_patient_visible']
        ]

        # Get patient's visible notes
        response = requests.get(
            f"{BASE_URL}/patient/notes",
            headers={"x-user-email": PATIENT_EMAIL}
        )
        assert response.status_code == 200
        patient_notes = response.json()
        patient_note_ids = {note['note_id'] for note in patient_notes}

        # Assert internal staff notes are NOT visible to patient
        for staff_note in internal_staff_notes:
            assert staff_note['note_id'] not in patient_note_ids, \
                f"Patient should not see internal staff note {staff_note['note_id']}"

    def test_patient_cannot_see_internal_clinician_notes(self):
        """
        Assert that patient cannot access internal clinician notes
        """
        # Get all notes as clinician
        response = requests.get(
            f"{BASE_URL}/clinician/patients/{TEST_PATIENT_ID}/notes",
            headers={"x-user-email": CLINICIAN_EMAIL}
        )
        assert response.status_code == 200
        all_notes = response.json()

        # Find internal clinician notes (is_patient_visible = false)
        internal_clinician_notes = [
            note for note in all_notes 
            if note['note_type'] == 'clinician' and not note['is_patient_visible']
        ]

        # Get patient's visible notes
        response = requests.get(
            f"{BASE_URL}/patient/notes",
            headers={"x-user-email": PATIENT_EMAIL}
        )
        assert response.status_code == 200
        patient_notes = response.json()
        patient_note_ids = {note['note_id'] for note in patient_notes}

        # Assert internal clinician notes are NOT visible to patient
        for clinician_note in internal_clinician_notes:
            assert clinician_note['note_id'] not in patient_note_ids, \
                f"Patient should not see internal clinician note {clinician_note['note_id']}"

    def test_patient_can_see_patient_visible_ai_notes(self):
        """
        Assert that patient CAN see AI notes marked as patient-visible (positive control)
        """
        # Get patient's visible notes
        response = requests.get(
            f"{BASE_URL}/patient/notes",
            headers={"x-user-email": PATIENT_EMAIL}
        )
        assert response.status_code == 200
        patient_notes = response.json()

        # Find AI notes
        ai_notes = [note for note in patient_notes if note['note_type'] == 'ai']

        # Assert at least one AI note is visible
        assert len(ai_notes) > 0, "Patient should be able to see patient-visible AI notes"


class TestCrossRoleAccessControl:
    """Additional tests for cross-role access control"""

    def test_staff_cannot_access_patient_endpoint(self):
        """
        Assert that staff cannot access patient-specific endpoints
        """
        response = requests.get(
            f"{BASE_URL}/patient/notes",
            headers={"x-user-email": STAFF_EMAIL}
        )
        # Should return 403 Forbidden
        assert response.status_code == 403, "Staff should not access patient endpoints"

    def test_patient_cannot_access_staff_endpoint(self):
        """
        Assert that patient cannot access staff endpoints
        """
        response = requests.get(
            f"{BASE_URL}/staff/patients",
            headers={"x-user-email": PATIENT_EMAIL}
        )
        # Should return 403 Forbidden
        assert response.status_code == 403, "Patient should not access staff endpoints"

    def test_clinician_cannot_access_patient_endpoint(self):
        """
        Assert that clinician cannot access patient-specific endpoints
        """
        response = requests.get(
            f"{BASE_URL}/patient/notes",
            headers={"x-user-email": CLINICIAN_EMAIL}
        )
        # Should return 403 Forbidden
        assert response.status_code == 403, "Clinician should not access patient endpoints"


if __name__ == "__main__":
    # Run tests with pytest
    pytest.main([__file__, "-v", "--tb=short"])