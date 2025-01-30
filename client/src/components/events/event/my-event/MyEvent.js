import moment from "moment";
import { useStores } from "../../../../contexts/stores-context";
const MyEvent = ({ event, onGetCodeClick, onEditClick, onDeleteClick }) => {
  const { eventStore } = useStores();

  const selectEvent = () => {
    eventStore.setSelectedEvent(event.eventId);
  };

  return (
    <div className="eventList" onClick={selectEvent}>
      <div className="eventList-itemDiv">
        <h5 className="eventList-title">{event.title}</h5>
        <div className="eventList-itemDiv2">
          <p className="eventList-city">
            {event.city} {event.street} {event.buildingNumber}
          </p>
          <p className="eventList-Date">
            {moment(event.startDate).format("DD.MM.YYYY hh:mm")}
          </p>
          <div>
            {event.tagNames.map((tagName) => (
              <p key={tagName}>#{tagName}</p>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div>
          <p className="eventList-details">Szczegóły</p>
          <button className="eventList-details" onClick={onGetCodeClick}>
            Kod potwierdzenia
          </button>
        </div>
        <div>
          <button className="eventList-details" onClick={onEditClick}>
            Edytuj
          </button>
          <button
            className="eventList-details eventList-details-delete"
            onClick={onDeleteClick}
          >
            Usuń
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyEvent;
