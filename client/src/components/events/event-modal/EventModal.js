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
        isOrganizer() && (
          <button onClick={() => leaveEvent(selectedEvent.eventId)}>
            Zrezygnuj
          </button>
        )
      );
    } else {
      return (
        <button
          disabled={getDisabledMessage()}
          data-tooltip-id="join-tooltip"
          data-tooltip-content={getDisabledMessage()}
          onClick={() => joinEvent(selectedEvent.eventId)}
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

  const getModalContent = () => {
    if (participantProfile) {
      return (
        <>
          <p>Name: {participantProfile.name}</p>
          <p>{participantProfile.age > 0 && participantProfile.age}</p>
          <p>{participantProfile.gender}</p>
          <p>{participantProfile.description}</p>
          <button onClick={() => setParticipantProfile(null)}>Wróć</button>
        </>
      );
    } else {
      return (
        <>
          <p>
            Adres
            {` ${selectedEvent.city} ul. ${selectedEvent.street} ${selectedEvent.buildingNumber}`}
          </p>
          <p>
            Czas startu{" "}
            {moment(selectedEvent.startDate).format("DD.MM.YYYY hh:mm")}
          </p>
          <p>Opis: {selectedEvent.description}</p>

          <div
            onClick={(e) =>
              handleParticipantClick(e, selectedEvent.organizerId)
            }
          >
            <p>{selectedEvent.organizerName} - organizator</p>
          </div>

          <p>
            Uczestnicy: {participants.length}
            {selectedEvent.maxParticipation &&
              " / " + selectedEvent.maxParticipation}
          </p>
          {participants.map((participant) => (
            <div
              key={participant.participantId}
              onClick={(e) =>
                handleParticipantClick(e, participant.participantId)
              }
            >
              <p>{participant.participantName}</p>
            </div>
          ))}
          {getEventDetailsButton()}
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
