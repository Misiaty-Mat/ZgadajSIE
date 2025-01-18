import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import EventMarker from "./event-marker";
import BasicModal from "../../modal/BasicModal";
import { useStores } from "../../../contexts/event-context";

const EventMarkers = observer(() => {
  const clusterer = useRef(null);

  const [markers, setMarkers] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { eventStore } = useStores();

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

  const onMarkerClick = (pin) => {
    map.panTo({ lat: Number(pin.latitude), lng: Number(pin.longitude) });
    toggleModal();
    setSelectedEvent(getFullEventById(pin.eventId));
  };

  return (
    <>
      {eventStore.eventPins.map((pin) => (
        <AdvancedMarker
          key={pin.eventId}
          position={{ lat: Number(pin.latitude), lng: Number(pin.longitude) }}
          ref={(marker) => setMarkerRef(marker, pin.eventId)}
          onClick={() => onMarkerClick(pin)}
        >
          <EventMarker title={pin.titleShorten} />
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
});

export default EventMarkers;
