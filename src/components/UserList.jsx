import React, { useState, useEffect } from 'react';
import celebrities from '../data/celebrities.json';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [confirmAdd, setConfirmAdd] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    age: '',
    gender: '',
    country: '',
    description: '',
    picture: null,
  });

  useEffect(() => {
    const processedData = celebrities.map((user) => ({
      id: user.id,
      name: `${user.first} ${user.last}`,
      age: calculateAge(user.dob),
      gender: user.gender.charAt(0).toUpperCase() + user.gender.slice(1),
      country: user.country,
      description: user.description,
      picture: user.picture,
    }));
    setUsers(processedData);
  },[]);

  useEffect(() => {
    if (editMode) {
      const originalUser = users.find(user => user.id === editMode);
      setIsSaveEnabled(isUserModified(originalUser, editedUser));
    }
  }, [editedUser, editMode, users]);

  const isUserModified = (originalUser, editedUser) => {
    if (!originalUser) return false;
    return (
      originalUser.name !== editedUser.name ||
      originalUser.age !== editedUser.age ||
      originalUser.gender !== editedUser.gender ||
      originalUser.country !== editedUser.country ||
      originalUser.description !== editedUser.description
    );
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return age;
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleAccordion = (id) => {
    if (editMode) return;
    setExpandedUserId(expandedUserId === id ? null : id);
  };

  const startEdit = (user) => {
    if (user.age < 18) return; 
    setEditMode(user.id);
    setEditedUser(user);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const cancelEdit = () => {
    setEditMode(null);
    setEditedUser({});
  };

  const saveEdit = () => {
    setUsers(users.map((user) => (user.id === editMode ? editedUser : user)));
    setEditMode(null);
    setIsSaveEnabled(false);
  };

  const confirmDeleteUser = (id) => {
    setConfirmDelete(id);
  };

  const deleteUser = () => {
    setUsers(users.filter((user) => user.id !== confirmDelete));
    setConfirmDelete(null);
  };

  const handleAddChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'picture') {
      setNewUser({ ...newUser, picture: URL.createObjectURL(files[0]) });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const saveNewUser = () => {
    if (!newUser.name || !newUser.age || !newUser.gender || !newUser.country) {
      alert('Please fill out all required fields: Name, Age, Gender, and Country.');
      return;
    }

    const newUserId = users.length ? users[users.length - 1].id + 1 : 1;
    const newUserData = { ...newUser, id: newUserId };
    setUsers([newUserData, ...users]);
    setConfirmAdd(false);
    setNewUser({
      name: '',
      age: '',
      gender: '',
      country: '',
      description: '',
      picture: null,
    });
  };

  const cancelAddUser = () => {
    setConfirmAdd(false);
    setNewUser({
      name: '',
      age: '',
      gender: '',
      country: '',
      description: '',
      picture: null,
    });
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-list">
      <h2>Profile Nexus</h2>
      <input
        type="text"
        placeholder="Search user"
        value={searchTerm}
        onChange={handleSearch}
      />

      <div>
        <button 
          className="add-user"
          onClick={() => setConfirmAdd(true)}
        >
        <i class="fa-solid fa-user-plus"> Add User</i>
        </button>
      </div>

      {confirmAdd && (
        <div className="new-user-form">
          <label>Name
          <input
              type="text"
              name="name"
              value={newUser.name}
              onChange={handleAddChange}
              required
            />
        </label>
        <label>Age
        <input
            type="number"
            name="age"
            value={newUser.age}
            onChange={handleAddChange}
            required
          />
        </label>
        <label>Gender
          <select
              value={newUser.gender}
              onChange={handleAddChange}
              required
            >
              <option>Male</option>
              <option>Female</option>
              <option>Transgender</option>
              <option>Rather not say</option>
              <option>Other</option>
            </select>
        </label><br />   
        <label>Country
          <input
              type="text"              
              name="country"
              value={newUser.country}
              onChange={handleAddChange}
              required
            />
        </label>
        <label>Description
          <textarea
            name="description"
            value={newUser.description}
            onChange={handleAddChange}
            required
          />
        </label>
        <label>
            Picture
            <input
              type="file"
              name="picture"
              accept="image/*"
              onChange={handleAddChange}
            />
          </label>
        <button
          onClick={cancelAddUser}
          className ="cancel-btn">
          <i class="fa-regular fa-circle-xmark"></i>
        </button>
        <button 
          disabled={!isSaveEnabled}
          onClick={saveNewUser} 
          className ="save-btn">
          <i class="fa-regular fa-circle-check"></i>
        </button>
      </div>

      )}

      {filteredUsers.map((user) => (
        <div key={user.id} className="user-item">
          <div className="user-header" onClick={() => toggleAccordion(user.id)}>
            <img
              src={user.picture}
              alt={`${user.name}'s profile`}
              className="profile-picture"
            />
            {editMode === user.id ? (        
              <input
              type="text"
              name="name"
              value={editedUser.name}
              onChange={handleEditChange}
            />
            ):(
            <h3>{user.name}</h3>) 
            }
            <i
              className={`fas ${
                expandedUserId === user.id ? 'fa-angle-up' : 'fa-angle-down'
              }`}
            ></i>
          </div>

          {expandedUserId === user.id && (
            <div className="user-details">
              {editMode === user.id ? (
                <div>
                  <label>Age
                  <input
                      type="text"
                      value={editedUser.age}
                      readOnly
                    />
                  </label>
                  <label>Gender
                    <select
                        value={editedUser.gender}
                        onChange={handleEditChange}
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Transgender</option>
                        <option>Rather not say</option>
                        <option>Other</option>
                      </select>
                  </label>     
                  <label>Country
                    <input
                        type="text"
                        value={editedUser.country}
                        onChange={handleEditChange}
                      />
                  </label>
                  <label>Description
                    <textarea
                      name="description"
                      value={editedUser.description}
                      onChange={handleEditChange}
                    />
                  </label>
                  <button
                    onClick={cancelEdit}
                    class="cancel-btn">
                    <i class="fa-regular fa-circle-xmark"></i>
                  </button>
                  <button 
                    disabled={!isSaveEnabled}
                    onClick={saveEdit} 
                    class="save-btn">
                    <i class="fa-regular fa-circle-check"></i>
                  </button>
                </div>
              ) : (
                <div>
                  <span>Age: {user.age} Years </span>
                  <span> Gender: {user.gender} </span>
                  <span> Country: {user.country} </span>
                  <p>Description: {user.description}</p>
                  <div className="icons-container">
                    <button onClick={() => startEdit(user)} className="edit-btn">
                      <i className="fa-solid fa-pencil"></i>
                    </button>
                    <button
                      onClick={() => confirmDeleteUser(user.id)}
                      className="delete-btn"
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {confirmDelete && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this user?</p>
            <button className="final-cancel-btn" onClick={() => setConfirmDelete(null)}>Cancel</button>
            <button className="final-del-btn" onClick={deleteUser}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
