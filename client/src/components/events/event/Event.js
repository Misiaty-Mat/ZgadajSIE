import moment from "moment";
import "./eventList-style.css";

const Event = ({ event }) => {
  const showEvent = () => {
    alert("Mock eventu: " + event.title);
  };

  return (
    <div className="eventList">
      <div className="eventList-itemDiv">
        <h5 className="eventList-title">{event.title}</h5>
        <div className="eventList-itemDiv2">
          <p className="eventList-city">{event.city}</p>
          <p className="eventList-people">
            {event.participation}
            {event.maxParticipation ? "/" + event.maxParticipation : null}
          </p>
          <p className="eventList-Date">
            {moment(event.startDate).format("DD.MM.YYYY hh:mm")}
          </p>
        </div>
      </div>
      <button onClick={showEvent}>Szczegóły</button>
    </div>
  );
};

export default Event;
