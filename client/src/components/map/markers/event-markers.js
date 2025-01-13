import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import EventMarker from "./event-marker";
import BasicModal from "../../modal/BasicModal";

const EventMarkers = ({ points }) => {
  const clusterer = useRef(null);

  const [markers, setMarkers] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const map = useMap();

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

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
  };

  const getFullEventById = (eventId) => {
    return {
      id: eventId,
      title: "Wydarzenie o id: " + eventId,
      address: "Abc ul. def",
    };
  };

  const joinEvent = (eventId) => {
    alert("Joined event " + eventId);
  };

  const onMarkerClick = (point) => {
    map.panTo({ lat: point.lat, lng: point.lng });
    toggleModal();
    setSelectedEvent(getFullEventById(point.id));
  };

  return (
    <>
      {points.map((point) => (
        <AdvancedMarker
          key={point.id}
          position={{ lat: point.lat, lng: point.lng }}
          ref={(marker) => setMarkerRef(marker, point.id)}
          onClick={() => onMarkerClick(point)}
        >
          <EventMarker title={point.title} />
        </AdvancedMarker>
      ))}

      {selectedEvent && (
        <BasicModal
          isOpen={isModalOpen}
          title={selectedEvent.title}
          onClose={toggleModal}
        >
          {selectedEvent.address}
          <button onClick={() => joinEvent(selectedEvent.id)}>Dołącz!</button>
        </BasicModal>
      )}
    </>
  );
};

export default EventMarkers;
