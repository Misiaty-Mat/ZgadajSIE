import { useCallback, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import NavBar from "../../nav-bar/NavBar";
import {
  deleteEvent,
  fetchCreatedEvents,
  getConfirmationCode,
} from "../../../api/events/events";
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
import BasicModal from "../../modal/BasicModal";

const CreatedEvents = observer(() => {
  const [events, setEvents] = useState([]);
  const [codeModalOpened, setCodeModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const { eventStore } = useStores();

  const fetchMyEvents = useCallback(() => {
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

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents, isLoggedIn, user?.id]);

  useEffect(() => {
    if (!editModalOpened || !deleteModalOpened) {
      fetchMyEvents();
    }
  }, [deleteModalOpened, editModalOpened, fetchMyEvents]);

  const handleGetCodeClick = (e, eventId) => {
    e?.stopPropagation();
    getConfirmationCode(eventId)
      .then((response) => {
        setConfirmationCode(response.data.code);
      })
      .catch((error) => {
        if (error.status === 404) {
          toast.error("Nie znaleziono kodu dołączenia");
        } else {
          handleError(error);
        }
      });
    setCodeModalOpened(true);
  };

  const handleEditClick = (e, eventId) => {
    e?.stopPropagation();
    eventStore.setTargetEvent(eventId);
    setEditModalOpened(true);
  };

  const handleDeleteClick = (e, eventId) => {
    e?.stopPropagation();
    eventStore.setTargetEvent(eventId);
    setDeleteModalOpened(true);
  };

  const handleDeleteEvent = () => {
    deleteEvent(eventStore.targetEvent.eventId)
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
            onGetCodeClick={(e) => handleGetCodeClick(e, event.eventId)}
            onEditClick={(e) => handleEditClick(e, event.eventId)}
            onDeleteClick={(e) => handleDeleteClick(e, event.eventId)}
          />
        ))}
      </div>
      {eventStore.targetEvent && (
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
            <p style={{ fontSize: "20px" }}>
              Czy na pewno chcesz usunąć wydarzenie{" "}
              {eventStore.targetEvent.title}
            </p>
          </ConfirmActionModal>
        </>
      )}
      <BasicModal
        isOpen={codeModalOpened}
        title="Kod potwierdzenia przybycia"
        onClose={() => setCodeModalOpened(false)}
      >
        <p style={{ fontSize: "20px" }}>
          Przekaż osobie, która przybyła na twoje wydarzenie poniższy kod do
          zeskanowania
        </p>
        {confirmationCode && (
          <QRCode
            value={confirmationCode}
            size={150} // Size of the QR Code
            bgColor="#ffffff" // Background color
            fgColor="#000000" // Foreground color
          />
        )}

        <p style={{ fontSize: "20px" }}>Lub do ręcznego przepisania</p>
        <p style={{ fontSize: "20px" }}>{confirmationCode}</p>
      </BasicModal>
      <ToastContainer />
    </div>
  );
});

export default CreatedEvents;
