import { useEffect, useState } from "react";
import { fetchJoinedEvents } from "../../../api/events/events";
import { handleError } from "../../../api/utils";
import NavBar from "../../nav-bar/NavBar";
import Event from "../../events/event/Event";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./joinedEvents-style.css";
import { ToastContainer } from "react-toastify";

const JoinedEvents = () => {
  const [events, setEvents] = useState([]);

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

  return (
    <div>
      <NavBar />
      <div className="eventsJoined">
        <h1>Przyszłe wydarzenia</h1>
        {events.map((event) => (
          <Event key={event.eventId} event={event} />
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default JoinedEvents;
