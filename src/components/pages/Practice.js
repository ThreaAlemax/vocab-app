import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const Practice = () => {
  const [training, setTraining] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const { id } = useParams(); // Get the trainingId from the URL

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/training/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setTraining(data);
        setCurrentQuestion('Ready to begin?'); // Set the first question
      } catch (error) {
        console.error('Error fetching training:', error);
      }
    };

    fetchTraining();
  }, [id]);

  const handleAnswerSubmit = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/training/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, answer: userAnswer }),
      });
      const data = await response.json();
      setCurrentQuestion(data.message); // Update the question with the response
      setUserAnswer(''); // Clear the input
    } catch (error) {
      console.error('Error fetching next question:', error);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Practice</h1>
      {training ? (
        <div>
          <p>Type: {training.type}</p>
          <p>Words: {training.items.join(', ')}</p>
          <div className="w-full bg-white p-4 mb-4 max-w-screen-lg mx-auto text-left">
            <ReactMarkdown>{currentQuestion}</ReactMarkdown>
          </div>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="border p-2 mr-2"
          />
          <button
            onClick={handleAnswerSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Start
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Practice;