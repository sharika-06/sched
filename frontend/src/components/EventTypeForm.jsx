import { useState } from 'react';
import { createEventType } from '../api/eventTypeApi';
import { getToken } from '../utils/auth';

export default function EventTypeForm({ onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', duration_minutes: 30, slug: '', color: '#3b82f6' });

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = getToken();
      const res = await createEventType(form, token);
      onCreated(res.data);
      setForm({ title: '', description: '', duration_minutes: 30, slug: '', color: '#3b82f6' });
    } catch(err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.error || 'Failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded">
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <input name="slug" placeholder="Slug (unique)" value={form.slug} onChange={handleChange} required />
      <input name="duration_minutes" type="number" value={form.duration_minutes} onChange={handleChange} required />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="color" type="color" value={form.color} onChange={handleChange} />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">Create Event Type</button>
    </form>
  );
}
