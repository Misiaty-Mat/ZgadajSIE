const Event = ({ event }) => {
  return (
    <div>
      <h5>{event.title}</h5>
      <small>{event.body}</small>
    </div>
  );
};

export default Event;
