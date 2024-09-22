import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated, isAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);


  const handleSubmit = (e) => {
    e.preventDefault();
    // Send a POST request to the login endpoint
    fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          // Store the token in localStorage
          localStorage.setItem('token', data.access_token);

          // Optionally, store user details in localStorage
          const userDetails = { id: data.user.id, email: data.user.email, first_name: data.user.first_name, last_name: data.user.last_name };
          localStorage.setItem('user', JSON.stringify(userDetails));

          setIsAuthenticated(true);

        } else {
          alert('Invalid email or password');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-left">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-left">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Login
          </button>
          <div className="text-center mt-4">
            <a href="/register" className="text-blue-500">Create an account</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;