import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-6">Book appointments easily</h1>
      <p className="mb-6 text-gray-600">Create your personal booking page and let clients schedule meetings automatically.</p>
      <Link to="/signup" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500">Get Started</Link>
    </div>
  );
}