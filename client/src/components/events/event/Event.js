import moment from "moment";
import "./eventList-style.css";
import { useStores } from "../../../contexts/stores-context";
import { observer } from "mobx-react-lite";

const Event = observer(({ event }) => {
  const { eventStore } = useStores();

  const selectEvent = () => {
    eventStore.setSelectedEvent(event.eventId);
  };

  return (
    <div className="eventList" onClick={selectEvent}>
      <div className="eventList-itemDiv">
        <h5 className="eventList-title">{event.title}</h5>
        <div className="eventList-itemDiv2">
          <div className="eventList-city">
            <p className="eventList-city-item">{event.city},</p>
            <p className="eventList-city-item">
              {event.street} {event.buildingNumber}
            </p>
          </div>
          <p className="eventList-Date">
            {moment(event.startDate).format("DD.MM.YYYY hh:mm")}
          </p>
          <div className="eventList-Tags">
            {event.tagNames.map((tagName) => (
              <p className="eventList-Tags-items">#{tagName}</p>
            ))}
          </div>
        </div>
      </div>
      <p className="eventList-details eventList-details-mainPage">Szczegóły</p>
    </div>
  );
});

export default Event;
