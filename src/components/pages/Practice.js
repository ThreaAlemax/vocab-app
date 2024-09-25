import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Practice = () => {
  const [training, setTraining] = useState(null);
  const [chatBoxMessages, setChatBoxMessages] = useState([]);
  const [chatBoxAlerts, setChatBoxAlerts] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState([]);
  const [isPracticeStarted, setIsPracticeStarted] = useState(false);
  const { id } = useParams(); // Get the trainingId from the URL

  // load the training and list data
  useEffect(() => {
    fetchTraining().then(() => {
      getTrainingWords().then(() => {
        initPractice();
      });
    });
  }, [id]);

  // move the user to the next question when word changes
  useEffect(() => {
    getNextQuestion();
  }, [currentWordIndex]);

  const getObfuscatedWord = (word) => {
    return word.split('').map(() => '_').join(' ');
  };

  const getObfuscatedSentence = (sentence, word) => {
    return sentence.replace(word, getObfuscatedWord(word));
  }

  const fetchTraining = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/training/${id}`, {
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

  const getTrainingWords = async () => {
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
      localStorage.setItem('words', JSON.stringify(data));

      setWords(data);
      setChatBoxMessages([]);
      setUserAnswer('');
    } catch (error) {
      console.error('Error fetching next question:', error);
    }
  };

  const getInitialWordsHtml = async (words) => {
    let fullMessage = '';
    let message = '';

    Object.entries(words).map(([word, details]) => {
      message = `
        <div class="trainig-word text-left my-4">
          <h2 class="trainig-word__word text-2xl font-semibold">${word} <span>(${details.phonetic})</span></h2>
          <p class="trainig-word__type">${details.type}</p>
          <p class="trainig-word__definition">${details.definition}</p>
          <p class="trainig-word__example"><em>${details.example}</em></p>
        </div>`;
      fullMessage += message;
    })
    return fullMessage;
  };

  const addChatBoxMessage = (message) => {
    setChatBoxMessages((prevMessages) => [{ type: 'message', message }]);
  };

  const addChatBoxAlert = (type, message, mode = 'default') => {
    const alert = { type, message };

    setChatBoxAlerts((prevAlerts) => [alert]);

    if (mode === 'default') {
      setTimeout(() => {
        setChatBoxAlerts((prevAlerts) => prevAlerts.filter((a) => a !== alert));
      }, 2000);
    }
  };

  const initPractice = () => {
    const words = JSON.parse(localStorage.getItem('words'));
    setWords(words);

    getInitialWordsHtml(words).then((initialMessages) => {
      addChatBoxAlert('default','Welcome to the practice session!', 'keep');
      addChatBoxMessage(initialMessages);
    });
  };

  const startPractice = () => {
    const words = JSON.parse(localStorage.getItem('words'));
    getNextQuestion();
    setIsPracticeStarted(true);
  };

  const getNextQuestion = () => {
    setUserAnswer('');
    console.log(currentWordIndex);
    const words = JSON.parse(localStorage.getItem('words'));
    const currentWord = Object.keys(words)[currentWordIndex];
    const currentWordData = words[currentWord];

    const obfuscatedWord = getObfuscatedWord(currentWord);
    const obfuscatedSentence = getObfuscatedSentence(currentWordData.example, currentWord);
    const html = `
      <p class="my-4">${obfuscatedSentence}</p>
      <p class="my-10">${obfuscatedWord}</p>
    `;
    addChatBoxMessage(html);
  };

  const handleUserSubmit = () => {
    const words = JSON.parse(localStorage.getItem('words'));
    const currentWord = Object.keys(words)[currentWordIndex];
    const currentWordData = words[currentWord];

    if (userAnswer.toLowerCase() === currentWord) {
      addChatBoxAlert('success', 'Correct!');

      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      console.log(currentWordIndex);
      getNextQuestion()
    } else {
      addChatBoxAlert('error', 'Incorrect. Try again.');
    }
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Practice</h1>
      {training ? (
        <div>
          <div
            className="chatbox w-full bg-white p-4 pt-0 mb-4 max-h-96 min-h-96 max-w-screen-lg mx-auto text-left overflow-auto relative">
              {chatBoxAlerts.map((alert, index) => (
                <div className={`chatbox-alerts z-10 h-16 text-center sticky top-0 w-full bg-white py-5 chatbox-alert--${alert.type}`}>
                  <div key={index} className={`chatbox-alert chatbox-alert chatbox-alert--${alert.type}`}>
                    {alert.message}
                  </div>
                </div>
              ))}
            <div className="chatbox-messages top-20 absolute w-full">
              <hr className="my-10"/>
              {chatBoxMessages.map((msg, index) => (
                <p key={index} className="my-10 text-center" dangerouslySetInnerHTML={{__html: msg.message}}></p>
              ))}
            </div>
          </div>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUserSubmit();
              }
            }}
            className="border p-2 mr-2"
          />
          <button
            onClick={handleUserSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            disabled={!isPracticeStarted}
          >
            Submit
          </button>
          <button
            onClick={startPractice}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ml-2"
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