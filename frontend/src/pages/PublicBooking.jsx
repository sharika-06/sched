/*import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { format, parseISO } from 'date-fns';

export default function PublicBooking(){
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');



  useEffect(() => {
  async function load() {
    try {
      const [eventRes, slotsRes] = await Promise.all([
        api.get(`/event-types/${slug}`),
        api.get(`/bookings/availability/${slug}`)
      ]);
      setEvent(eventRes.data.event);
      setSlots(slotsRes.data.availableSlots || []);
    } catch (e) {
      console.error(e);
    }
  }
  load();
}, [slug]);

  async function book(e){
    e.preventDefault();
    if (!selected) return alert('Pick a slot');
    try {
      const payload = { slug, start: selected.start, end: selected.end, guest_name: name, guest_email: email };
      const res = await api.post('/bookings', payload);
      alert('Booked! id: ' + res.data.bookingId);
    } catch (err) {
      if (err.response?.status === 409) alert('Slot taken, pick another');
      else alert(err.response?.data?.error || 'Error booking');
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-semibold mb-4">Book with {event?.title || slug}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Available slots</h3>
            <div className="space-y-2">
              {slots.length === 0 && <div>No slots</div>}
              {slots.map(s => (
                <button key={s.start} onClick={() => setSelected(s)} className={`w-full text-left p-3 rounded-xl border ${selected?.start===s.start ? 'border-indigo-500' : 'border-slate-200'}`}>
                  <div className="font-medium">{format(parseISO(s.start), 'EEE, MMM d • h:mm a')}</div>
                  <div className="text-sm text-slate-500">{format(parseISO(s.end), 'h:mm a')}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <form onSubmit={book} className="p-4 border rounded-xl">
              <h3 className="text-lg font-medium mb-3">Confirm booking</h3>
              <div className="mb-2">{selected ? new Date(selected.start).toLocaleString() : 'No slot selected'}</div>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="w-full p-2 border rounded mb-2" />
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email" className="w-full p-2 border rounded mb-2" />
              <button type="submit" className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded">Book</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}        */


import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api'; // Assuming this handles getEventTypeBySlug, createBooking, etc.
import SlotPicker from '../components/SlotPicker'; // New component
import { format, parseISO } from 'date-fns';

export default function PublicBooking() {
 const { slug } = useParams();
 const [event, setEvent] = useState(null);
 const [slots, setSlots] = useState([]);
 const [selected, setSelected] = useState(null);
 const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [isBooking, setIsBooking] = useState(false);
 const [error, setError] = useState(null);

 // --- Data Fetching ---
 useEffect(() => {
 async function load() {
 try {
 // Reset selected slot and error on slug change
 setSelected(null);
 setError(null);
        
        const [eventRes, slotsRes] = await Promise.all([
          api.get(`/event-types/${slug}`),
          api.get(`/bookings/availability/${slug}`) // Fetches slots with the 'isBooked' flag
        ]);
        setEvent(eventRes.data.event);
        setSlots(slotsRes.data.availableSlots || []);
      } catch (e) {
        console.error(e);
        setError('Failed to load event or availability.');
      }
    }
    load();
  }, [slug]);

  // --- Booking Logic ---
  async function book(e) {
    e.preventDefault();
    if (!selected) return alert('Please pick a time slot.');
    if (!name || !email) return alert('Please provide your name and email.');

    setIsBooking(true);

    try {
      const payload = { slug, start: selected.start, end: selected.end, guest_name: name, guest_email: email };
      const res = await api.post('/bookings', payload);

      alert(`Booking confirmed! ID: ${res.data.bookingId}. A confirmation email has been sent.`);
      
      // Refresh slots after successful booking to immediately mark the time as taken
      const slotsRes = await api.get(`/bookings/availability/${slug}`);
      setSlots(slotsRes.data.availableSlots || []);

      // Reset state
      setSelected(null);
      setName('');
      setEmail('');
      
    } catch (err) {
      if (err.response?.status === 409) {
        alert('Slot was just taken by someone else, please pick another time.');
        // Force refresh on conflict
        const slotsRes = await api.get(`/bookings/availability/${slug}`);
        setSlots(slotsRes.data.availableSlots || []);
        setSelected(null); // Deselect the taken slot
      }
      else alert(err.response?.data?.error || 'Error booking.');
    } finally {
      setIsBooking(false);
    }
  }

  const isFormValid = selected && name.trim() && email.trim() && !isBooking;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-semibold mb-4">Book with {event?.title || slug}</h1>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. Slot Picker Section */}
          <div>
            <SlotPicker 
              slots={slots} 
              onSelect={setSelected} 
              selected={selected} 
            />
          </div>

          {/* 2. Confirmation/Form Section */}
          <div>
            <form onSubmit={book} className="sticky top-6 p-4 border rounded-xl shadow-lg">
              <h3 className="text-lg font-medium mb-3">Your Details</h3>
              
              {/* Selected Slot Display */}
              <div className={`mb-4 p-3 rounded-lg ${selected ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                <strong>Time:</strong> {selected ? format(parseISO(selected.start), 'EEE, MMM d • h:mm a') : 'Please select a slot'}
              </div>
              
              {/* Name Input */}
              <input 
                value={name} 
                onChange={e=>setName(e.target.value)} 
                placeholder="Your name" 
                className="w-full p-2 border rounded mb-2 focus:ring-indigo-500 focus:border-indigo-500" 
                required
              />
              
              {/* Email Input */}
              <input 
                type="email"
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                placeholder="Your email" 
                className="w-full p-2 border rounded mb-2 focus:ring-indigo-500 focus:border-indigo-500" 
                required
              />
              
              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={!isFormValid} 
                className={`mt-2 px-4 py-2 w-full font-semibold rounded transition-colors ${
                  isFormValid
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-indigo-300 text-indigo-100 cursor-not-allowed'
                }`}
              >
                {isBooking ? 'Booking...' : 'Confirm and Book'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}