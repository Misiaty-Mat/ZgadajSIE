import { AdvancedMarker } from "@vis.gl/react-google-maps";
import "./event-marker.css";
import { useCallback } from "react";

const EventMarker = ({ event, onClick, setMarkerRef }) => {
  const handleClick = useCallback(() => {
    onClick(event);
  }, [onClick, event]);

  const ref = useCallback(
    (marker) => setMarkerRef(marker, event.eventId),
    [setMarkerRef, event.eventId]
  );

  return (
    <AdvancedMarker
      position={{ lat: event.latitude, lng: event.longitude }}
      ref={ref}
      onClick={handleClick}
    >
      <div className="markerDiv">
        <p className="markerTitle">{event.title}</p>
        <div className="marker"></div>
      </div>
    </AdvancedMarker>
  );
};

export default EventMarker;
