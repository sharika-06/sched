import { useEffect, useState } from 'react';
import { getMyEventTypes } from '../api/eventTypeApi';
import { getToken } from '../utils/auth';

export default function EventTypeList() {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const res = await getMyEventTypes(token);
      setEvents(res.data);
    };
    fetchData();
  }, []);

  return (
    <div className="mt-4">
      {events.map(e => (
        <div key={e.id} className="p-2 border rounded mb-2">
          <span style={{backgroundColor: e.color}} className="p-1 rounded text-white mr-2">{e.title}</span>
          <span>{e.description}</span>
        </div>
      ))}
    </div>
  );
}
