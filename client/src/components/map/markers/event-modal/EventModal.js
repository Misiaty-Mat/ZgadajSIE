import moment from "moment";
import { Tooltip } from "react-tooltip";
import BasicModal from "../../../modal/BasicModal";
import { useAuth } from "../../../../hooks/useAuth";
import { joinEventPost } from "../../../../api/events/events";
import { toast } from "react-toastify";
import { handleError } from "../../../../api/utils";

const EventModal = ({ selectedEvent, isModalOpen, toggleModal }) => {
  const { isLoggedIn, user } = useAuth();

  const isOrganizer = () => {
    return selectedEvent.organizerId === user?.id;
  };

  const joinEvent = (eventId) => {
    joinEventPost(eventId)
      .then((response) => {
        toast.success("Dołączono do wydarzenia!");
      })
      .catch((error) => handleError(error));
    toggleModal();
  };

  const getTooltipMessage = () => {
    if (isOrganizer()) {
      return "Jesteś twórcą tego wydarzenia!";
    } else if (!isLoggedIn) {
      return "Zaloguj się by dołączyć do tego wydarzenia!";
    }
  };

  return (
    <BasicModal
      isOpen={isModalOpen}
      title={selectedEvent.title}
      onClose={toggleModal}
    >
      <p>
        {`${selectedEvent.city} ul. ${selectedEvent.street} ${selectedEvent.buildingNumber}`}
      </p>
      <p>{moment(selectedEvent.startDate).format("DD.MM.YYYY hh:mm")}</p>
      <p>{selectedEvent.description}</p>
      <button
        disabled={!isLoggedIn || isOrganizer()}
        data-tooltip-id="join-tooltip"
        data-tooltip-content={getTooltipMessage()}
        onClick={() => joinEvent(selectedEvent.eventId)}
      >
        Dołącz!
      </button>
      <Tooltip id="join-tooltip" />
    </BasicModal>
  );
};

export default EventModal;
