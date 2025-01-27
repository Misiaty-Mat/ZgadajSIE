import { observer } from "mobx-react-lite";
import Event from "../event/Event";
import { useStores } from "../../../contexts/stores-context";
import AddEventButton from "../add-event/button/AddEventButton";

import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../../hooks/useAuth";
import { useEffect } from "react";
import useGeolocation from "../../../hooks/useGeolocation";

const EventList = observer(() => {
  const { eventStore } = useStores();
  const { isLoggedIn } = useAuth();
  const { location } = useGeolocation();

  useEffect(() => {
    eventStore.fetchEvents(location);
  }, [eventStore, location]);

  return (
    <>
      <div className="main-page-sectionLeft-inputs">
        {/* utwórz wydarzenie */}
        {isLoggedIn && (
          <div className="main-page-sectionLeft-inputDiv">
            <AddEventButton />
          </div>
        )}
      </div>
      {eventStore.paginatedEvents.map((event) => (
        <Event key={event.eventId} event={event} />
      ))}
      {/* Wczytanie kolejnych X wydarzeń */}
      {!eventStore.isLastPage && (
        <button onClick={eventStore.incrementPage}>...</button>
      )}
    </>
  );
});

export default EventList;
