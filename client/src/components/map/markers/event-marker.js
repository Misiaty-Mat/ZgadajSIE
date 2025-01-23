import "./event-marker.css";

const EventMarker = ({ title }) => (
  <>
    <div className="markerDiv">
      <p className="markerTitle">{title}</p> <div className="marker"></div>
    </div>
  </>
);

export default EventMarker;
