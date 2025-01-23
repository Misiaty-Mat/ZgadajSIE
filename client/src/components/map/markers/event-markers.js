import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { debounce } from "lodash";
import EventMarker from "./event-marker";
import { useStores } from "../../../contexts/event-context";
import { fetchEventById } from "../../../api/events/events";
import { handleError } from "../../../api/utils";
import EventModal from "./event-modal/EventModal";

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

  const setMarkerRef = debounce((marker, id) => {
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
  }, 100);

  const onMarkerClick = (pin) => {
    map.panTo({ lat: pin.latitude, lng: pin.longitude });
    fetchEventById(pin.eventId)
      .then((response) => {
        setSelectedEvent(response.data.event);
      })
      .catch((error) => {
        handleError(error);
      });
    toggleModal();
  };

  return (
    <>
      {eventStore.filteredEvents.map((pin) => (
        <AdvancedMarker
          key={pin.eventId}
          position={{ lat: pin.latitude, lng: pin.longitude }}
          ref={(marker) => setMarkerRef(marker, pin.eventId)}
          onClick={() => onMarkerClick(pin)}
        >
          <EventMarker title={pin.title} />
        </AdvancedMarker>
      ))}

      {selectedEvent && (
        <EventModal
          selectedEvent={selectedEvent}
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
        />
      )}
    </>
  );
});

export default EventMarkers;
