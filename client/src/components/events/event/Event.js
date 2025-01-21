import moment from "moment";

const Event = ({ event }) => {
  const showEvent = () => {
    alert("Mock eventu: " + event.title);
  };

  return (
    <div>
      <h5>{event.title}</h5>
      <p>{event.city}</p>
      <p>
        {event.participation}
        {event.maxParticipation ? "/" + event.maxParticipation : null}
      </p>
      <p>{moment(event.startDate).format("DD.MM.YYYY hh:mm")}</p>
      <button onClick={showEvent}>Szczegóły</button>
    </div>
  );
};

export default Event;
