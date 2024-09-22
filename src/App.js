import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';

import UserHeader from "./components/UserHeader";
import UserList from "./components/UserList";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import CreateUser from './components/CreateUser';

import './App.css';

// dotenv.config();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }}
      ).then((response) => {
        return response.json()
      }).then((data) => {
        if (data.valid === true) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
        }
      }).catch(error => {
        console.error('Error fetching user\'s profile:', error);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [setIsAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <header>
          <UserHeader isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        </header>

        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/login" element={<Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;