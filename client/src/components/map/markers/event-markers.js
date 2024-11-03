import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import EventMarker from "./event-marker";

const EventMarkers = ({ points }) => {
  const map = useMap();
  const [markers, setMarkers] = useState({});
  const clusterer = useRef(null);

  useEffect(() => {
    if (!map) return;

    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker, id) => {
    if (marker && markers[id]) return;
    if (!marker && !markers[id]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [id]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[id];
        return newMarkers;
      }
    });
  }

  const onMarkerClick = (point) => {
    map.panTo({ lat: point.lat, lng: point.lng })
  }

  return (
    <>
      {points.map((point) => (
        <AdvancedMarker
          key={point.id}
          position={{ lat: point.lat, lng: point.lng }}
          ref={(marker) => setMarkerRef(marker, point.id)}
          onClick={() => onMarkerClick(point)}
        >
          <EventMarker point={point.id} />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default EventMarkers;
