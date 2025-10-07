import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Signup(){
  const { register, handleSubmit } = useForm();
  const nav = useNavigate();

  const onSubmit = async data => {
    try {
      const res = await api.post('/auth/signup', { ...data, role: 'organizer' });
      localStorage.setItem('token', res.data.token);
      nav('/dashboard');
    } catch (e) { alert(e.response?.data?.error || 'Error'); }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('name')} placeholder="Full Name" className="w-full p-2 border rounded" />
        <input {...register('email')} placeholder="Email" className="w-full p-2 border rounded" />
        <input {...register('password')} type="password" placeholder="Password" className="w-full p-2 border rounded" />
        <button className="w-full p-2 bg-indigo-600 text-white rounded">Sign Up</button>
      </form>
    </div>
  );
}
