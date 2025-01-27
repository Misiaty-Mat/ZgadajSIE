import moment from "moment";
import "./eventList-style.css";
import { useStores } from "../../../contexts/stores-context";
import { observer } from "mobx-react-lite";

const Event = observer(({ event }) => {
  const { eventStore } = useStores();

  const selectEvent = () => {
    eventStore.setSelectedEvent(event);
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
              <p>#{tagName}</p>
            ))}
          </div>
        </div>
      </div>
      <button onClick={selectEvent}>Szczegóły</button>
    </div>
  );
});

export default Event;
