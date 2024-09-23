import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from '../utilities/Modal';

const Dashboard = () => {
  const [trainings, setTrainings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTraining, setNewTraining] = useState({ type: '', name: '', items: [''] });
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

  const handleItemChange = (index, value) => {
    const updatedItems = [...newTraining.items];
    updatedItems[index] = value;
    setNewTraining(prevState => ({ ...prevState, items: updatedItems }));
  };

  const handleAddItem = () => {
    setNewTraining(prevState => ({ ...prevState, items: [...prevState.items, ''] }));
  };

  const handleRemoveItem = (index) => {
    const updatedItems = newTraining.items.filter((_, i) => i !== index);
    setNewTraining(prevState => ({ ...prevState, items: updatedItems }));
  };

  const handleNewTrainingSubmit = (e) => {
    e.preventDefault();
    const method = newTraining.id ? 'PATCH' : 'POST';
    const url = newTraining.id
      ? `${process.env.REACT_APP_API_URL}/training/${newTraining.id}`
      : `${process.env.REACT_APP_API_URL}/training`;

    fetch(url, {
      method,
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
        setNewTraining({ type: '', name: '', items: [''] });
      })
      .catch(error => {
        console.error('Error creating/updating training:', error);
      });
  };

  const handleEditTraining = (training) => {
    setNewTraining(training);
    setShowModal(true);
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

  const handleStartTraining = (id) => {
    navigate(`/practice/${id}`);
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
            <td className="py-2 px-4 border-b">
              {training.items && training.items.join(', ')}
            </td>
            <td className="py-2 px-4 border-b">{training.created_at}</td>
            <td className="py-2 px-4 border-b">
              <button
                className="text-blue-500 hover:text-blue-700 mr-2"
                onClick={() => handleStartTraining(training.id)}
              >
                Start
              </button>
              <button
                className="text-green-500 hover:text-green-700 mr-2"
                onClick={() => handleEditTraining(training)}
              >
                Edit
              </button>
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
        <Modal title="New Training" onClose={() => setShowModal(false)}>
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
            <div className="mb-4">
              <label className="block text-gray-700 text-left">Words:</label>
              {Array.isArray(newTraining.items) && newTraining.items.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-gray-500 hover:text-gray-700 py-1 px-1 rounded"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddItem}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Add Word
              </button>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default Dashboard;