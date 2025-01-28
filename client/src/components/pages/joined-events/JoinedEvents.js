import { useEffect, useRef, useState } from "react";
import { fetchJoinedEvents } from "../../../api/events/events";
import { handleError } from "../../../api/utils";
import NavBar from "../../nav-bar/NavBar";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./joinedEvents-style.css";
import { ToastContainer } from "react-toastify";
import JoinedEvent from "../../events/event/joined-event/JoinedEvent";
import BasicModal from "../../modal/BasicModal";
import ConfirmEventArrivalForm from "../../events/event/joined-event/confirm-event-arrival/ConfirmEventArrivalForm";

const JoinedEvents = () => {
  const [events, setEvents] = useState([]);
  const [arrivalModalOpened, setArrivalModalOpened] = useState(false);

  const eventIdRef = useRef();

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      fetchJoinedEvents()
        .then((response) => {
          setEvents(response.data.joinedEvents);
        })
        .catch((error) => handleError(error));
    } else {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleConfirmArrivalClick = (e, eventId) => {
    e?.stopPropagation();
    setArrivalModalOpened(true);
    eventIdRef.current = eventId;
  };

  return (
    <div>
      <NavBar />
      <div className="eventsJoined">
        <h1>Przyszłe wydarzenia</h1>
        {events.map((event) => (
          <JoinedEvent
            key={event.eventId}
            event={event}
            onConfirmArrivalClick={(e) =>
              handleConfirmArrivalClick(e, event.eventId)
            }
          />
        ))}
      </div>
      <BasicModal
        isOpen={arrivalModalOpened}
        title="Potwierdź przybycie"
        onClose={() => setArrivalModalOpened(false)}
      >
        <ConfirmEventArrivalForm
          eventId={eventIdRef.current}
          onSubmit={() => setArrivalModalOpened(false)}
        />
      </BasicModal>
      <ToastContainer />
    </div>
  );
};

export default JoinedEvents;
