import React, { useEffect, useState } from "react";

const UserHeader = ( {isAuthenticated, setIsAuthenticated }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userDetails = JSON.parse(user);  // Parse the stored string to an object
      setUsername(userDetails.first_name);  // Extract the username and set it to state
    }
  }, []);

  return (
    <header className="bg-blue-500 p-4 flex justify-between">
      <div className="text-white inline-block">
        <h2 className="text-2xl font-bold my-4">Robbie</h2>
      </div>
        {isAuthenticated ? (
          <>
          <div className="text-right w-full flex items-center justify-end">
            <div className="text-white inline-block">
              <span className="my-4 font-bold">Welcome {username}</span>
              <button
                className="bg-white text-blue-500 px-4 py-2 rounded ml-4 inline-block"
                onClick={() => {
                  localStorage.clear();
                  setIsAuthenticated(false);
                }}
              >
                Logout
              </button>
            </div>
          </div>
          </>
          ) : (
          <div className="text-right w-full flex items-center justify-end">
            <a href="/login" className="text-white font-bold">Login</a>
          </div>
          )}
          </header>
        );
        }

      export default UserHeader;