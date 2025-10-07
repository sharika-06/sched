 /*import { useEffect, useState } from 'react';
import { getAvailableSlots } from '../api/eventTypeApi';
/*
export default function AvailableSlots({ slug, onSelect }) {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const fetchSlots = async () => {
      const res = await getAvailableSlots(slug);
      setSlots(res.data.slots);
    };
    fetchSlots();
  }, [slug]);

  return (
    <div>
      {slots.length === 0 && <p>No available slots</p>}
      <div className="grid grid-cols-2 gap-2">
        {slots.map(s => (
          <button key={s.start} className="p-2 bg-green-500 text-white rounded" onClick={() => onSelect(s)}>
            {new Date(s.start).toLocaleString()} - {new Date(s.end).toLocaleTimeString()}
          </button>
        ))}
      </div>
    </div>
  );
}


export default function AvailableSlots({ slug, onSelect, refresh }) {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const fetchSlots = async () => {
      const res = await getAvailableSlots(slug);
      setSlots(res.data.availableSlots || res.data.slots); // Make sure backend returns correct field
    };
    fetchSlots();
  }, [slug, refresh]); // ✅ add refresh as a dependency

  return (
    <div>
      {slots.length === 0 && <p>No available slots</p>}
      
      {/* REPLACE THIS OLD BUTTON GRID }
      {/*
      <div className="grid grid-cols-2 gap-2">
        {slots.map(s => (
          <button key={s.start} className="p-2 bg-green-500 text-white rounded" onClick={() => onSelect(s)}>
            {new Date(s.start).toLocaleString()} - {new Date(s.end).toLocaleTimeString()}
          </button>
        ))}
      </div>
      }

      {/* WITH THIS NEW ONE }
      <div className="grid grid-cols-2 gap-2">
        {slots.map(s => (
          <button
            key={s.start}
            disabled={s.isBooked}
            className={`p-2 rounded ${
              s.isBooked ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 text-white'
            }`}
            onClick={() => !s.isBooked && onSelect(s)}
          >
            {new Date(s.start).toLocaleString()} - {new Date(s.end).toLocaleTimeString()}
          </button>
        ))}
      </div>
    </div>
  );
}      */


  import { useEffect, useState } from 'react';
import { getAvailableSlots } from '../api/eventTypeApi';
/*
export default function AvailableSlots({ slug, onSelect }) {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const fetchSlots = async () => {
      const res = await getAvailableSlots(slug);
      setSlots(res.data.slots);
    };
    fetchSlots();
  }, [slug]);

  return (
    <div>
      {slots.length === 0 && <p>No available slots</p>}
      <div className="grid grid-cols-2 gap-2">
        {slots.map(s => (
          <button key={s.start} className="p-2 bg-green-500 text-white rounded" onClick={() => onSelect(s)}>
            {new Date(s.start).toLocaleString()} - {new Date(s.end).toLocaleTimeString()}
          </button>
        ))}
      </div>
    </div>
  );
}
*/
/*
import React from 'react';
export default function AvailableSlots({ slots, onSelect }) {
  if (!slots || !slots.length) return <p>No available slots</p>;

  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {slots.map(slot => (
        <button
          key={slot.start}
          disabled={slot.isBooked}
          className={`p-2 rounded ${
            slot.isBooked ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 text-white'
          }`}
          onClick={() => !slot.isBooked && onSelect(slot)}
        >
          {new Date(slot.start).toLocaleString()} - {new Date(slot.end).toLocaleTimeString()}
        </button>
      ))}
    </div>
  );
}                                              */



  import React from 'react';

export default function AvailableSlots({ slots, onSelect }) {
  if (!slots || !slots.length) return <p>No available slots</p>;

  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {slots.map(slot => {
            // 🚨 LOG THE isBooked STATUS
            console.log(`Slot ${slot.start} | isBooked: ${slot.isBooked} | Type: ${typeof slot.isBooked}`);
            
            // Define the CSS class string
            const slotClass = slot.isBooked
                    ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed' 
                    : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700';

            return (
        <button
          key={slot.start}
          disabled={slot.isBooked}
          className={`p-2 rounded font-medium border-2 border-transparent transition duration-150 ease-in-out ${slotClass}`}
          onClick={() => !slot.isBooked && onSelect(slot)}
        >
          {new Date(slot.start).toLocaleString()} - {new Date(slot.end).toLocaleTimeString()}
        </button>
            );
          })}
    </div>
  );
}                


