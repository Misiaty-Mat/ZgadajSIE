import useEvents from "../../../hooks/useEvents";
import Event from "../event/Event";

const EventList = () => {
  const events = useEvents();

  return (
    <div>
      <h1>Event List</h1>
      {events.map((event) => (
        <Event key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
