import React, { useState, useEffect } from 'react';
import api from '../api';

const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export default function AvailabilityEditor(){
  const [list, setList] = useState([]);
  const [day, setDay] = useState('Monday');
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('17:00');

  useEffect(() => { load(); }, []);

  async function load(){
    try {
      const res = await api.get('/availability');
      setList(res.data.availability || []);
    } catch (e) { console.error(e); }
  }

  async function add(){
    try {
      await api.post('/availability', { day_of_week: day, start_time: start, end_time: end });
      alert('Added');
      load();
    } catch (e) { alert(e.response?.data?.error || 'Error'); }
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Availability</h2>
      <div className="flex gap-2 mb-4">
        <select value={day} onChange={e=>setDay(e.target.value)} className="p-2 border rounded">
          {days.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <input type="time" value={start} onChange={e=>setStart(e.target.value)} className="p-2 border rounded" />
        <input type="time" value={end} onChange={e=>setEnd(e.target.value)} className="p-2 border rounded" />
        <button onClick={add} className="px-3 bg-indigo-600 text-white rounded">Add</button>
      </div>

      <div>
        {list.map(l => (
          <div key={l.id} className="p-2 border rounded mb-2">
            {l.day_of_week} — {l.start_time} to {l.end_time}
          </div>
        ))}
      </div>
    </div>
  );
}
