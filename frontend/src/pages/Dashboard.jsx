
/*
import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get('/event-types/mine', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Make sure to use the property returned by your backend
        setEvents(res.data.events || []);
      } catch (e) {
        console.error(e);
        setEvents([]);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="space-x-2">
          <Link to="/create-event" className="px-4 py-2 bg-indigo-600 text-white rounded">Create Event</Link>
          <Link to="/availability" className="px-4 py-2 border rounded">Availability</Link>
        </div>
      </div>

      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="p-4 bg-white rounded shadow">No event types yet.</div>
        ) : (
          events.map(ev => (
            <div key={ev.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
              <div>
                <div className="font-semibold">{ev.title}</div>
                <div className="text-sm text-slate-500">{ev.duration_minutes} minutes • /book/{ev.slug}</div>
              </div>
              <div>
                <a href={`/book/${ev.slug}`} target="_blank" rel="noreferrer" className="text-indigo-600">
                  Open Booking Page
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

*/


import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get('/event-types/mine', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Use the property returned by your backend
        setEvents(res.data.events || []);
      } catch (e) {
        console.error(e);
        setEvents([]);
      }
    }
    load();
  }, []);

  // Function to copy guest booking link
  const copyLink = (slug) => {
    const url = `${window.location.origin}/book/${slug}`;
    navigator.clipboard.writeText(url);
    alert('Guest link copied: ' + url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="space-x-2">
          <Link to="/create-event" className="px-4 py-2 bg-indigo-600 text-white rounded">Create Event</Link>
          <Link to="/availability" className="px-4 py-2 border rounded">Availability</Link>
        </div>
      </div>

      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="p-4 bg-white rounded shadow">No event types yet.</div>
        ) : (
          events.map(ev => (
            <div key={ev.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
              <div>
                <div className="font-semibold">{ev.title}</div>
                <div className="text-sm text-slate-500">{ev.duration_minutes} minutes • /book/{ev.slug}</div>
                <div className="mt-1">
  <a 
    href={`${window.location.origin}/book/${ev.slug}`} 
    target="_blank" 
    rel="noreferrer" 
    className="text-indigo-600 mr-2"
  >
    Open Booking Page
  </a>
  <button 
    onClick={() => copyLink(ev.slug)}
    className="px-2 py-1 bg-gray-200 rounded text-sm"
  >
    Copy Link
  </button>
</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
