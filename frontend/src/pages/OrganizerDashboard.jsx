import EventTypeForm from '../components/EventTypeForm';
import EventTypeList from '../components/EventTypeList';

export default function OrganizerDashboard() {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Organizer Dashboard</h1>
      <EventTypeForm onCreated={() => window.location.reload()} />
      <EventTypeList />
    </div>
  );
}