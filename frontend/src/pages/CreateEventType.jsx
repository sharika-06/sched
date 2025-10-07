import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function CreateEventType() {
  const { register, handleSubmit } = useForm();
  const nav = useNavigate();

  const onSubmit = async data => {
    try {
      await api.post('/event-types', data);
      alert('Event type created');
      nav('/dashboard');
    } catch (e) {
      alert(e.response?.data?.error || 'Error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Create Event Type</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register('title')} placeholder="Title (e.g., 30-min consult)" className="w-full p-2 border rounded" />
        <input {...register('slug')} placeholder="Public slug (unique, e.g., consult)" className="w-full p-2 border rounded" />
        <input {...register('duration_minutes')} placeholder="Duration (minutes)" type="number" className="w-full p-2 border rounded" />
        <textarea {...register('description')} placeholder="Description" className="w-full p-2 border rounded"></textarea>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Create</button>
      </form>
    </div>
  );
}
