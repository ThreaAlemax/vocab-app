import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";

const Header = ({isAuthenticated, setIsAuthenticated }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userDetails = JSON.parse(user);  // Parse the stored string to an object
      setUsername(userDetails.first_name);  // Extract the username and set it to state
    }
  }, []);

  return (
    <div className="">
      <div className="bg-blue-500 p-4 flex justify-between">
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
            <a href="/pages/Login" className="text-white font-bold">Login</a>
          </div>
        )}
      </div>
      <nav className="bg-blue-500 flex flex-row space-x-4 px-3 py-2">
        <ul className="flex flex-row space-x-4 text-white font-semibold">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/practice">Practice</Link></li>
          {/* Add other navigation links here */}
        </ul>
      </nav>
    </div>
  )
    ;
}

export default Header;