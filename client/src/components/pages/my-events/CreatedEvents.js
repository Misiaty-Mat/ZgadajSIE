import { useEffect, useState } from "react";
import NavBar from "../../nav-bar/NavBar";
import { fetchCreatedEvents } from "../../../api/events/events";
import { handleError } from "../../../api/utils";
import Event from "../../events/event/Event";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./createdEvents-style.css";

const CreatedEvents = () => {
  const [events, setEvents] = useState([]);

  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
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
    } else {
      navigate("/");
    }
  }, [isLoggedIn, navigate, user?.id]);

  return (
    <div>
      <NavBar />
      <div className="divCreatedEvents">
        <h1>Stworzone wydarzenia</h1>
        {events.map((event) => (
          <Event key={event.eventId} event={event} />
        ))}
      </div>
    </div>
  );
};

export default CreatedEvents;
