import moment from "moment";
import { Tooltip } from "react-tooltip";
import { toast } from "react-toastify";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import BasicModal from "../modal/BasicModal";
import { useAuth } from "../../hooks/useAuth";
import {
  fetchParticipants,
  joinEventPost,
  leaveEventPost,
} from "../../api/events/events";
import { handleError } from "../../api/utils";
import { useCallback, useEffect, useState } from "react";
import { useStores } from "../../contexts/event-context";

const EventModal = observer(() => {
  const [participants, setParticipants] = useState([]);

  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const {
    eventStore: { selectedEvent, eventModalOpened, toggleEventModal },
  } = useStores();

  const getParticipants = useCallback(async () => {
    fetchParticipants(selectedEvent.eventId)
      .then((response) => {
        setParticipants(response.data.participants);
      })
      .catch((error) => {
        handleError(error);
        setParticipants([]);
      });
  }, [selectedEvent.eventId]);

  const isOrganizer = () => {
    return selectedEvent.organizerId === user?.id;
  };

  const isFull = () => {
    return selectedEvent.maxParticipation === participants.length;
  };

  useEffect(() => {
    getParticipants();
  }, [getParticipants]);

  const joinEvent = (eventId) => {
    joinEventPost(eventId)
      .then(() => toast.success("Dołączono do wydarzenia!"))
      .catch((error) => handleError(error));
    toggleEventModal();
  };

  const leaveEvent = (eventId) => {
    leaveEventPost(eventId)
      .then(() => {
        toast.success("Zrezygnowano z uczestniczenia w wydarzeniu");
        navigate(0);
      })
      .catch((error) => handleError(error));
  };

  const getTooltipMessage = () => {
    if (isOrganizer()) {
      return "Jesteś twórcą tego wydarzenia!";
    } else if (isFull()) {
    } else if (!isLoggedIn) {
      return "Zaloguj się by dołączyć do tego wydarzenia!";
    }
  };

  const getEventDetailsButton = () => {
    const isParticipant =
      isLoggedIn &&
      participants &&
      participants.some((participantId) => {
        return participantId === user.id;
      });

    if (isParticipant) {
      return (
        <button onClick={() => leaveEvent(selectedEvent.eventId)}>
          Zrezygnuj
        </button>
      );
    } else {
      return (
        <button
          disabled={!isLoggedIn || isOrganizer()}
          data-tooltip-id="join-tooltip"
          data-tooltip-content={getTooltipMessage()}
          onClick={() => joinEvent(selectedEvent.eventId)}
        >
          Dołącz!
        </button>
      );
    }
  };

  return (
    <BasicModal
      isOpen={eventModalOpened}
      title={selectedEvent.title}
      onClose={toggleEventModal}
    >
      <p>
        Adres
        {` ${selectedEvent.city} ul. ${selectedEvent.street} ${selectedEvent.buildingNumber}`}
      </p>
      <p>
        Czas startu {moment(selectedEvent.startDate).format("DD.MM.YYYY hh:mm")}
      </p>
      <p>Opis: {selectedEvent.description}</p>

      <p>
        Uczestnicy: {participants.length}
        {selectedEvent.maxParticipation &&
          " / " + selectedEvent.maxParticipation}
      </p>
      {getEventDetailsButton()}
      <Tooltip id="join-tooltip" />
    </BasicModal>
  );
});

export default EventModal;
