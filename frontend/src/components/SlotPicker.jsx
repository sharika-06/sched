/*import React from 'react'
import { format, parseISO } from 'date-fns'

export default function SlotPicker({ slots, onSelect, selected }){
  if (!slots.length) return <div>No available slots</div>
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Available slots</h3>
      <div className="space-y-2">
        {slots.map(s => (
          <button key={s.start} onClick={() => onSelect(s)} className={`w-full text-left p-3 rounded-xl border ${selected && selected.start===s.start ? 'border-indigo-500' : 'border-slate-200'}`}>
            <div className="font-medium">{format(parseISO(s.start), 'EEE, MMM d • h:mm a')}</div>
            <div className="text-sm text-slate-500">{format(parseISO(s.end), 'h:mm a')}</div>
          </button>
        ))}
      </div>
    </div>
  )
}  */



  import React from 'react';
import { format, parseISO } from 'date-fns';

export default function SlotPicker({ slots, onSelect, selected }){
  // CRITICAL CHANGE: Filter out booked slots
  const availableSlots = slots.filter(s => !s.isBooked);

  if (!availableSlots.length) return <div className="text-slate-500">No available slots in the next month.</div>

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Available slots</h3>
      <div className="space-y-2">
        {availableSlots.map(s => (
          <button 
            key={s.start} 
            onClick={() => onSelect(s)} 
            className={`
              w-full text-left p-3 rounded-xl border transition-all 
              ${
                selected && selected.start === s.start 
                  ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                  : 'border-slate-200 hover:border-indigo-300'
              }
            `}
          >
            <div className="font-medium">{format(parseISO(s.start), 'EEE, MMM d')}</div>
            <div className="text-sm text-slate-500">{format(parseISO(s.start), 'h:mm a')} - {format(parseISO(s.end), 'h:mm a')}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
