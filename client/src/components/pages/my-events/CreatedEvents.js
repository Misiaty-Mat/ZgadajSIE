import { useCallback, useEffect, useState } from "react";
import NavBar from "../../nav-bar/NavBar";
import { deleteEvent, fetchCreatedEvents } from "../../../api/events/events";
import { handleError } from "../../../api/utils";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import MyEvent from "../../events/event/my-event/MyEvent";
import EditEventModal from "../../events/event/my-event/EditEventModal";
import { observer } from "mobx-react-lite";
import { useStores } from "../../../contexts/stores-context";
import { toast, ToastContainer } from "react-toastify";
import ConfirmActionModal from "../../modal/ConfirmActionModal";
import "./createdEvents-style.css";

const CreatedEvents = observer(() => {
  const [events, setEvents] = useState([]);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);

  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const { eventStore } = useStores();

  const fetchMyEvents = useCallback(() => {
    fetchCreatedEvents()
      .then((response) => {
        setEvents(
          response.data.createdEvents.map((event) => ({
            ...event,
            organizerId: user?.id,
          }))
        );
      })
      .catch((error) => handleError(error));
  }, [user?.id]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchMyEvents();
    }
  }, [fetchMyEvents, isLoggedIn, navigate, user?.id]);

  useEffect(() => {
    if (!editModalOpened || !deleteModalOpened) {
      fetchMyEvents();
    }
  }, [deleteModalOpened, editModalOpened, fetchMyEvents]);

  const handleEditClick = (e, event) => {
    e?.stopPropagation();
    eventStore.setModifiedEvent(event.eventId);
    setEditModalOpened(true);
  };

  const handleDeleteClick = (e, eventId) => {
    e?.stopPropagation();
    eventStore.setModifiedEvent(eventId);
    setDeleteModalOpened(true);
  };

  const handleDeleteEvent = () => {
    deleteEvent(eventStore.modifiedEvent.eventId)
      .then(() => {
        setDeleteModalOpened(false);
        toast.success("Pomyślnie usunięto wydarzenie");
      })
      .catch((error) => handleError(error));
  };

  return (
    <div>
      <NavBar />
      <div className="divCreatedEvents">
        <h1>Stworzone wydarzenia</h1>
        {events.map((event) => (
          <MyEvent
            key={event.eventId}
            event={event}
            onEditClick={(e) => handleEditClick(e, event)}
            onDeleteClick={(e) => handleDeleteClick(e, event.eventId)}
          />
        ))}
      </div>
      {eventStore.modifiedEvent && (
        <>
          <EditEventModal
            isOpened={editModalOpened}
            setIsOpened={setEditModalOpened}
          />
          <ConfirmActionModal
            title="Usunięcie wydarzenia"
            onConfirm={handleDeleteEvent}
            isOpened={deleteModalOpened}
            setIsOpened={setDeleteModalOpened}
          >
            <p>
              Czy na pewno chcesz usunąć wydarzenie{" "}
              {eventStore.modifiedEvent.title}
            </p>
          </ConfirmActionModal>
        </>
      )}
      <ToastContainer />
    </div>
  );
});

export default CreatedEvents;
