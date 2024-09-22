import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Practice = () => {
  const [training, setTraining] = useState(null);
  const { trainingId } = useParams(); // Get the trainingId from the URL

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/training/${trainingId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setTraining(data);
      } catch (error) {
        console.error('Error fetching training:', error);
      }
    };

    fetchTraining();
  }, [trainingId]);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Practice</h1>
      {training ? (
        <div>
          <p>Type: {training.type}</p>
          <p>
            {training.items.join(', ')}
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Practice;