import moment from "moment";
import { Tooltip } from "react-tooltip";
import { toast } from "react-toastify";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import BasicModal from "../../modal/BasicModal";
import { useAuth } from "../../../hooks/useAuth";
import {
  fetchEventParticipantProfile,
  fetchParticipants,
  joinEventPost,
  leaveEventPost,
} from "../../../api/events/events";
import { handleError } from "../../../api/utils";
import { useCallback, useEffect, useState } from "react";
import { useStores } from "../../../contexts/stores-context";
import "./eventModal-style.css";

const EventModal = observer(() => {
  const [participants, setParticipants] = useState([]);
  const [participantProfile, setParticipantProfile] = useState();

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

  const getDisabledMessage = () => {
    if (!isLoggedIn) {
      return "Zaloguj się by dołączyć do tego wydarzenia!";
    } else if (isOrganizer()) {
      return "Jesteś twórcą tego wydarzenia!";
    } else if (isFull()) {
      return "Niestety, ale do wydarzenia dołączyła już maksymalna ilość osób";
    }
  };

  const getEventDetailsButton = () => {
    const isParticipant =
      isLoggedIn &&
      participants &&
      participants.some((participant) => {
        return participant.participantId === user?.id;
      });

    if (isParticipant) {
      return (
        <button
          className="eventViev-button"
          onClick={() => leaveEvent(selectedEvent.eventId)}
        >
          Zrezygnuj
        </button>
      );
    } else {
      return (
        <button
          disabled={getDisabledMessage()}
          data-tooltip-id="join-tooltip"
          data-tooltip-content={getDisabledMessage()}
          onClick={() => joinEvent(selectedEvent.eventId)}
          className="eventViev-button"
        >
          Dołącz!
        </button>
      );
    }
  };

  const handleParticipantClick = (e, participantId) => {
    e?.stopPropagation();
    fetchEventParticipantProfile(selectedEvent.eventId, participantId)
      .then((response) => {
        setParticipantProfile(response.data.user);
      })
      .catch((error) => handleError(error));
  };

  const mapGender = (gender) => {
    if (gender === "male") {
      return "Mężczyzna";
    } else if (gender === "female") {
      return "Kobieta";
    } else {
      return "Nie podano płci";
    }
  };

  const getModalContent = () => {
    if (participantProfile) {
      return (
        <>
          <div className="eventViev">
            <p className="eventViev--item">{participantProfile.name}</p>
            <p className="eventViev--item">
              {participantProfile.age > 0 && participantProfile.age} lat
            </p>
            <p className="eventViev--item">
              {mapGender(participantProfile.gender)}
            </p>
            <p className="eventViev--item">{participantProfile.description}</p>
            <button
              className="eventViev-button"
              onClick={() => setParticipantProfile(null)}
            >
              Wróć
            </button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="eventViev">
            <p className="eventViev--item">
              Adres:
              {` ${selectedEvent.city} ul. ${selectedEvent.street} ${selectedEvent.buildingNumber}`}
            </p>
            <p className="eventViev--item">
              Czas startu:{" "}
              {moment(selectedEvent.startDate).format("DD.MM.YYYY HH:mm")}
            </p>
            <p className="eventViev--item">Opis: {selectedEvent.description}</p>

            <div
              className="eventViev--item organizer-style"
              onClick={(e) =>
                handleParticipantClick(e, selectedEvent.organizerId)
              }
            >
              <p>{selectedEvent.organizerName} - organizator</p>
            </div>

            <p className="eventViev--item">
              Uczestnicy: {participants.length}
              {selectedEvent.maxParticipation &&
                " / " + selectedEvent.maxParticipation}
            </p>
            {participants.map((participant) => (
              <div
                className="eventViev--item"
                key={participant.participantId}
                onClick={(e) =>
                  handleParticipantClick(e, participant.participantId)
                }
              >
                <p>{participant.participantName}</p>
              </div>
            ))}
            {getEventDetailsButton()}
          </div>
        </>
      );
    }
  };

  return (
    <BasicModal
      isOpen={eventModalOpened}
      title={selectedEvent.title}
      onClose={toggleEventModal}
    >
      {getModalContent()}
      <Tooltip id="join-tooltip" />
    </BasicModal>
  );
});

export default EventModal;
