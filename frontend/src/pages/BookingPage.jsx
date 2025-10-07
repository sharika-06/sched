/*import { useState, useEffect } from 'react';
import { getEventTypeBySlug } from '../api/eventTypeApi';
import { createBooking } from '../api/bookingApi';
import AvailableSlots from '../components/AvailableSlots';
import { useParams } from 'react-router-dom';

export default function BookingPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [guest, setGuest] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await getEventTypeBySlug(slug);
      setEvent(res.data.event);
    };
    fetchEvent();
  }, [slug]);

  /*const handleBook = async () => {
    try {
      const payload = {
  event_type_id: event.id,
  start: selectedSlot.start,
  end: selectedSlot.end,
  guest_name: guest.name,
  guest_email: guest.email
};

      const res = await createBooking(payload);
      alert(res.data.message);
      setSelectedSlot(null);
      setGuest({ name: '', email: '' });
    } catch (err) {
    }
  };                                                                         
      alert(err.response?.data?.error || 'Booking failed');




/*  const handleBook = async () => {
  try {
    const payload = {
      event_type_id: event.id,
      start: selectedSlot.start,
      end: selectedSlot.end,
      guest_name: guest.name,
      guest_email: guest.email
    };

    const res = await createBooking(payload);
    alert('Booking confirmed!');

    setSelectedSlot(null);
    setGuest({ name: '', email: '' });

   // REFRESH slots
    const updated = await getEventTypeBySlug(slug); 
    setEvent(updated.data.event);
  } catch (err) {
    alert(err.response?.data?.error || 'Booking failed');
  }
  };                                                                





  // Add a state to track refresh
const [refreshSlots, setRefreshSlots] = useState(0);

// Update handleBook
const handleBook = async () => {
  try {
    const payload = {
      event_type_id: event.id,
      start: selectedSlot.start,
      end: selectedSlot.end,
      guest_name: guest.name,
      guest_email: guest.email
    };

    await createBooking(payload);
    alert('Booking confirmed!');

    setSelectedSlot(null);
    setGuest({ name: '', email: '' });

    // Trigger refresh
    setRefreshSlots(prev => prev + 1);

  } catch (err) {
    alert(err.response?.data?.error || 'Booking failed');
  }
};


// BookingPage




  if (!event) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold" style={{color: event.color}}>{event.title}</h1>
      <p>{event.description}</p>

   <AvailableSlots slug={slug} key={refreshSlots} onSelect={setSelectedSlot} />                    

      {selectedSlot && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold">Confirm Booking</h2>
          <p>{new Date(selectedSlot.start).toLocaleString()}</p>

          <input 
            type="text" 
            placeholder="Your Name" 
            value={guest.name} 
            onChange={e => setGuest({...guest, name: e.target.value})} 
            className="block w-full border p-2 mt-2"
          />
          <input 
            type="email" 
            placeholder="Your Email" 
            value={guest.email} 
            onChange={e => setGuest({...guest, email: e.target.value})} 
            className="block w-full border p-2 mt-2"
          />

          <button onClick={handleBook} className="mt-3 p-2 bg-blue-500 text-white rounded">
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}                 */



  import { useState, useEffect } from 'react';
import { getEventTypeBySlug } from '../api/eventTypeApi';
import { createBooking } from '../api/bookingApi';
import AvailableSlots from '../components/AvailableSlots';
import { useParams } from 'react-router-dom';

export default function BookingPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [guest, setGuest] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await getEventTypeBySlug(slug);
      setEvent(res.data.event);
    };
    fetchEvent();
  }, [slug]);

  const handleBook = async () => {
    try {
      const payload = {
  event_type_id: event.id,
  start: selectedSlot.start,
  end: selectedSlot.end,
  guest_name: guest.name,
  guest_email: guest.email
};

      const res = await createBooking(payload);
      alert(res.data.message);
      setSelectedSlot(null);
      setGuest({ name: '', email: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Booking failed');
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold" style={{color: event.color}}>{event.title}</h1>
      <p>{event.description}</p>

     <AvailableSlots 
  slots={event.availableSlots} 
  onSelect={setSelectedSlot}
/>
      {selectedSlot && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold">Confirm Booking</h2>
          <p>{new Date(selectedSlot.start).toLocaleString()}</p>

          <input 
            type="text" 
            placeholder="Your Name" 
            value={guest.name} 
            onChange={e => setGuest({...guest, name: e.target.value})} 
            className="block w-full border p-2 mt-2"
          />
          <input 
            type="email" 
            placeholder="Your Email" 
            value={guest.email} 
            onChange={e => setGuest({...guest, email: e.target.value})} 
            className="block w-full border p-2 mt-2"
          />

          <button onClick={handleBook} className="mt-3 p-2 bg-blue-500 text-white rounded">
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}
