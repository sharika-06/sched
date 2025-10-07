import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar(){
  const token = localStorage.getItem('token');
  const nav = useNavigate();
  const logout = () => { localStorage.removeItem('token'); nav('/'); };

  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <Link to="/" className="text-xl font-bold text-indigo-600">Schedly</Link>
      <div className="space-x-4">
        {token ? (
          <>
            <Link to="/dashboard" className="text-gray-700">Dashboard</Link>
            <button onClick={logout} className="text-red-600">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700">Login</Link>
            <Link to="/signup" className="text-gray-700">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
