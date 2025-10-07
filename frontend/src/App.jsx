import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateEventType from './pages/CreateEventType';
import AvailabilityEditor from './pages/AvailabilityEditor';
import PublicBooking from './pages/PublicBooking';

function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App(){
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/create-event" element={<RequireAuth><CreateEventType /></RequireAuth>} />
          <Route path="/availability" element={<RequireAuth><AvailabilityEditor /></RequireAuth>} />
          <Route path="/book/:slug" element={<PublicBooking />} />
        </Routes>
      </div>
    </Router>

   

  );
}
