// AdminManagementUI.jsx

import React, { useState, useEffect } from 'react';
import CustomTable from '../components/CustomTable';
import CustomButton from '../components/CustomButton';
import SearchBar from '../components/SearchBar';
import './AdminManagementUI.css';
import Navbar from '../components/Navbar';

function AdminManagementUI() {
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    user_id: '',
    email: '',
    password: '',
    user_type: 'staff',
    clinic_id: ''
  });

  // 1️⃣ View all users
  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/all',{
        headers: { 'x-user-email': localStorage.getItem('email') }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  // 2️⃣ Search users by email
  const searchUsers = async () => {
    try {
      const query = searchEmail ? `?email=${searchEmail}` : '';
      const res = await fetch(`http://localhost:5000/api/users${query}`,{
        headers: { 'x-user-email': localStorage.getItem('email') }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to search users:', err);
    }
  };

  // 3️⃣ Create user
  const createUser = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-email': localStorage.getItem('email') },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        alert('User created successfully');
        setShowCreateModal(false);
        resetForm();
        fetchUsers();
      } else {
        alert('Failed to create user');
      }
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  // 4️⃣ Update user (password / role)
  const updateUser = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${selectedUser.user_id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-user-email': localStorage.getItem('email') },
          body: JSON.stringify({ password: formData.password })
        }
      );

      const data = await res.json();
      if (data.success) {
        alert('User updated successfully');
        setShowEditModal(false);
        fetchUsers();
      } else {
        alert('Failed to update user');
      }
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  // 5️⃣ Delete user
  const deleteUser = async (user_id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${user_id}`,
        {
          method: 'DELETE',
          headers: { 'x-user-email': localStorage.getItem('email') }
        }
      );

      const data = await res.json();
      if (data.success) {
        alert('User deleted successfully');
        fetchUsers();
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      user_id: '',
      email: '',
      password: '',
      user_type: 'staff',
      clinic_id: ''
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    searchUsers();
  }, [searchEmail]);

  return (
    <div className="container" style={{ marginTop: '80px' }}>
      <Navbar />
      <h2>Admin – User Management</h2>

      <div className="top-bar">
        <SearchBar
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />

        <CustomButton
          text="Create User"
          onClick={() => setShowCreateModal(true)}
        />
      </div>

      <CustomTable
        columns={[
          { id: 'user_id', label: 'User ID' },
          { id: 'email', label: 'Email' },
          { id: 'user_type', label: 'Role' },
          { id: 'clinic_id', label: 'Clinic' }
        ]}
        data={users}
        onEdit={(user) => {
          setSelectedUser(user);
          setFormData({ ...formData, password: '' });
          setShowEditModal(true);
        }}
        onDelete={(user) => deleteUser(user.user_id)}
      />

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create User</h3>
              <button className="close-button" onClick={() => setShowCreateModal(false)}>×</button>
            </div>

            {['user_id', 'email', 'password', 'clinic_id'].map(field => (
              <div className="form-group" key={field}>
                <label>{field.replace('_', ' ')}</label>
                <input
                  className="form-control"
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                />
              </div>
            ))}

            <div className="form-group">
              <label>Role</label>
              <select
                className="form-control"
                value={formData.user_type}
                onChange={(e) =>
                  setFormData({ ...formData, user_type: e.target.value })
                }
              >
                <option value="staff">Staff</option>
                <option value="clinician">Clinician</option>
                <option value="patient">Patient</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="modal-footer">
              <button className="btn btn-cancel" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button className="btn btn-create" onClick={createUser}>
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit User</h3>
              <button className="close-button" onClick={() => setShowEditModal(false)}>×</button>
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                className="form-control"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-cancel" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn btn-create" onClick={updateUser}>
                Update User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminManagementUI;
