import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [trainings, setTrainings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTraining, setNewTraining] = useState({ type: '', name: '' });
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchTrainings = () => {
    fetch(`${process.env.REACT_APP_API_URL}/training`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(trainings => setTrainings(trainings))
      .catch(error => {
        console.error('Error fetching user\'s trainings:', error);
      });
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetchTrainings();
  }, [navigate]);

  const handleNewTrainingChange = (e) => {
    const { name, value } = e.target;
    setNewTraining(prevState => ({ ...prevState, [name]: value }));
  };

  const handleNewTrainingSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/training`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTraining),
    })
      .then(res => res.json())
      .then(training => {
        fetchTrainings();
        setShowModal(false);
        setNewTraining({ type: '', name: '' });
      })
      .catch(error => {
        console.error('Error creating new training:', error);
      });
  };

  const handleDeleteTraining = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/training/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        fetchTrainings();
      })
      .catch(error => {
        console.error('Error deleting training:', error);
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Vocabulary Training</h1>
      <button
        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        onClick={() => setShowModal(true)}
      >
        New Training
      </button>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 border-b">ID</th>
          <th className="py-2 px-4 border-b">Name</th>
          <th className="py-2 px-4 border-b">Type</th>
          <th className="py-2 px-4 border-b">Words</th>
          <th className="py-2 px-4 border-b">Created At</th>
          <th className="py-2 px-4 border-b">Actions</th>
        </tr>
        </thead>
        <tbody>
        {trainings.map(training => (
          <tr key={training.id} className="hover:bg-gray-100">
            <td className="py-2 px-4 border-b">{training.id}</td>
            <td className="py-2 px-4 border-b">{training.name}</td>
            <td className="py-2 px-4 border-b">{training.type}</td>
            <td className="py-2 px-4 border-b"></td>
            <td className="py-2 px-4 border-b">{training.created_at}</td>
            <td className="py-2 px-4 border-b">
              <a href="#" className="text-blue-500 hover:text-blue-700 mr-2">Start</a>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDeleteTraining(training.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">New Training</h2>
            <form onSubmit={handleNewTrainingSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-left">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newTraining.name}
                  onChange={handleNewTrainingChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-left">Type:</label>
                <select
                  name="type"
                  value={newTraining.type}
                  onChange={handleNewTrainingChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select Type</option>
                  <option value="vocab">Vocabulary</option>
                  <option value="spelling">Spelling</option>
                  <option value="vocab_spelling">Vocabulary + Spelling</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;