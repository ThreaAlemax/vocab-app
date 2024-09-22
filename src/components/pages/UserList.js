import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // probably not needed
    // if (!token) {
    //   navigate('/login');
    //   return;
    // }

    fetch(`${process.env.REACT_APP_API_URL}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (res.status === 401) {
          navigate('/login');
          return;
        }
        return res.json();
      })
      .then(users => setUsers(users))
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, [navigate]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 border-b">ID</th>
          <th className="py-2 px-4 border-b">Email</th>
          <th className="py-2 px-4 border-b">Password</th>
          <th className="py-2 px-4 border-b">First Name</th>
          <th className="py-2 px-4 border-b">Last Name</th>
          <th className="py-2 px-4 border-b">Created At</th>
          <th className="py-2 px-4 border-b">Modified At</th>
        </tr>
        </thead>
        <tbody>
        {users.map(user => (
          <tr key={user.id} className="hover:bg-gray-100">
            <td className="py-2 px-4 border-b">{user.id}</td>
            <td className="py-2 px-4 border-b">{user.email}</td>
            <td className="py-2 px-4 border-b">{user.password}</td>
            <td className="py-2 px-4 border-b">{user.first_name}</td>
            <td className="py-2 px-4 border-b">{user.last_name}</td>
            <td className="py-2 px-4 border-b">{user.created_at}</td>
            <td className="py-2 px-4 border-b">{user.modified_at}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;