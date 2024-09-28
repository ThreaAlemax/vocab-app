import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

function ChatBox({ alerts, messages }) {
  function ChatBoxAlert({ alert }) {
    return (
      <div className={`chatbox-alert chatbox-alert--${alert.type} py-2`}>
        {alert.message}
      </div>
    );
  }

  function ChatBoxMessage({ message }) {
    return (
      <div className="my-10 text-center">
        {message}
      </div>
    );
  }

  return (
    <div className="chatbox w-full bg-white p-4 pt-0 mb-4 max-h-96 min-h-96 max-w-screen-lg mx-auto text-left overflow-auto relative">
      <div className="chatbox-alerts z-10 h-16 text-center sticky top-0 w-full bg-white py-5">
        {alerts.map((alert, index) => (
          <ChatBoxAlert key={index} alert={alert} />
        ))}
      </div>
      <div className="chatbox-messages top-20 absolute w-full">
        <hr className="my-10" />
        {messages.map((msg, index) => (
          <ChatBoxMessage key={index} message={msg.message} />
        ))}
      </div>
    </div>
  );
}

function TrainingWordsList({ words }){
  return Object.entries(words).map(([word, details]) => (
    <div className="trainig-word text-left my-4" key={word}>
      <h2 className="trainig-word__word text-2xl font-semibold">
        {word} <span>({details.phonetic})</span>
      </h2>
      <p className="trainig-word__type">{details.type}</p>
      <p className="trainig-word__definition">{details.definition}</p>
      <p className="trainig-word__example"><em>{details.example}</em></p>
    </div>
  ));
}

function PracticeSummary({ results }) {
  const summary = results.reduce((acc, result) => {
    if (!acc[result.word]) {
      acc[result.word] = { correct: 0, total: 0 };
    }
    acc[result.word].total += 1;
    if (result.isCorrect) {
      acc[result.word].correct += 1;
    }
    return acc;
  }, {});

  const accuracy = ((results.filter(result => result.isCorrect).length / results.length) * 100).toFixed(2);

  return (
    <div className="summary text-left mx-auto max-w-screen-md bg-white">
      <h2 className="text-2xl font-bold my-4">Summary</h2>
      <table className="table-auto w-full">
        <thead>
        <tr>
          <th className="px-4 py-2">Word</th>
          <th className="px-4 py-2">Result</th>
        </tr>
        </thead>
        <tbody>
        {Object.entries(summary).map(([word, { correct, total }], index) => (
          <tr key={index}>
            <td className="border px-4 py-2">{word}</td>
            <td className="border px-4 py-2">{`${correct}/${total}`}</td>
          </tr>
        ))}
        </tbody>
      </table>
      <p className="my-4">Accuracy: {accuracy}%</p>
    </div>
  );
}

function ObfuscatedQuestion({ word, sentence, answer }) {
  function getObfuscatedWord(word = '', userAnswer = '') {
    return word.split('').map((char, index) => (userAnswer[index] === char ? char : '_')).join(' ');
  }

  function getObfuscatedSentence(sentence = '', word = '') {
    return sentence.replace(word, getObfuscatedWord(word));
  }

  return (
    <>
      <p className="my-4">{getObfuscatedWord(word, answer)}</p>
      <p className="my-10">{getObfuscatedSentence(sentence, word)}</p>
    </>
  );
}

function Practice() {
  const { id } = useParams();
  const [training, setTraining] = useState(null);

  const [chatBoxMessages, setChatBoxMessages] = useState([]);
  const [chatBoxAlerts, setChatBoxAlerts] = useState([]);

  const [userAnswer, setUserAnswer] = useState('');
  const [userSubmittedAnswer, setUserSubmittedAnswer] = useState('');

  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const [isPracticeStarted, setIsPracticeStarted] = useState(false);
  const [practiceComplete, setPracticeComplete] = useState(false);

  const [results, setResults] = useState([]);

  function addChatBoxMessage (message) {
    setChatBoxMessages((prevMessages) => [ { type: 'default', message }]);
  }

  function addChatBoxAlert(type, message, mode = 'default') {
    setChatBoxAlerts((prevAlerts) => [{ type, message }]);

    if (mode === 'default') {
      setTimeout(() => {
        setChatBoxAlerts((prevAlerts) => prevAlerts.filter((a) => a !== alert));
      }, 2000);
    }
  }

  function handleUserSubmit(answer) {
    const currentWord = Object.keys(words)[currentWordIndex];
    const isCorrect = userAnswer.toLowerCase() === currentWord;

    setResults((prevResults) => [
      ...prevResults,
      { word: currentWord, isCorrect }
    ]);

    if (isCorrect) {
      addChatBoxAlert('success', 'Correct!');
      if (currentWordIndex === Object.keys(words).length - 1) {
        setPracticeComplete(true);
        addChatBoxAlert('success', 'You have completed all words!');
        addChatBoxMessage('');
      } else {
        setCurrentWordIndex((prevIndex) => prevIndex + 1);
      }
      setUserAnswer('');
    } else {
      setUserSubmittedAnswer(userAnswer);
      addChatBoxAlert('error', 'Incorrect. Try again.');
    }
  }

  const getNextQuestion = useCallback(() => {
    const currentWord = Object.keys(words)[currentWordIndex];
    const currentWordDetails = words[currentWord];
    addChatBoxMessage(
      <ObfuscatedQuestion word={currentWord} sentence={currentWordDetails.example} answer={userSubmittedAnswer} />
    );
  }, [words, currentWordIndex, userSubmittedAnswer]);

  useEffect(() => {
    const fetchTraining = async (id) => {
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

    const fetchTrainingWords = async (id) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/training/start`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        const trainingWords = await response.json();
        setWords(trainingWords);
        localStorage.setItem('words', JSON.stringify(trainingWords));
        return trainingWords;
      } catch (error) {
        console.error('Error fetching training words:', error);
      }
    };

    fetchTraining(id)
      .then(() => {
        fetchTrainingWords(id)
          .then((trainingWords) => {
            addChatBoxAlert( 'default', 'Welcome to the practice session!', 'keep');
            addChatBoxMessage(<TrainingWordsList words={trainingWords} />);
          });
      });
  }, [id]);

  useEffect(() => {
    if (isPracticeStarted) {
      getNextQuestion();
    }
  }, [getNextQuestion, isPracticeStarted]);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {training ? (
        <div>
          <h1 className="text-2xl font-bold mb-6">{training.name}</h1>
          <ChatBox alerts={chatBoxAlerts} messages={chatBoxMessages}/>
          {practiceComplete ? (
            <PracticeSummary results={results} />
          ) : (
            <>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUserSubmit(userAnswer);
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
                onClick={() => setIsPracticeStarted(true)}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ml-2"
              >
                Start
              </button>
            </>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Practice;