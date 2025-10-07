import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'

export default function BookingForm({ selectedSlot, eventId }){
  const { register, handleSubmit } = useForm();
  async function onSubmit(data){
    if (!selectedSlot) return alert('Pick a slot');
    try {
      const payload = {
        eventId,
        startUtc: selectedSlot.start,
        endUtc: selectedSlot.end,
        inviteeName: data.name,
        inviteeEmail: data.email,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      const res = await axios.post('/api/bookings', payload);
      alert('Booked! id: ' + res.data.bookingId);
    } catch (e){
      if (e.response?.status === 409) alert('Slot taken — please pick another');
      else alert('Error booking');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded-xl">
      <h3 className="text-lg font-medium mb-3">Confirm booking</h3>
      <div className="mb-2">{selectedSlot ? new Date(selectedSlot.start).toLocaleString() : 'No slot selected'}</div>
      <label className="block mb-2">
        <div className="text-sm">Name</div>
        <input {...register('name', { required: true })} className="w-full p-2 border rounded" />
      </label>
      <label className="block mb-2">
        <div className="text-sm">Email</div>
        <input {...register('email', { required: true })} className="w-full p-2 border rounded" />
      </label>
      <button type="submit" className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded">Book</button>
    </form>
  )
}
