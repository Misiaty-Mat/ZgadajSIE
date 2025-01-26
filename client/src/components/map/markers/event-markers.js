import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import EventMarker from "./event-marker";
import { useStores } from "../../../contexts/event-context";
import { fetchEventById } from "../../../api/events/events";
import { handleError } from "../../../api/utils";
import EventModal from "./event-modal/EventModal";

const EventMarkers = observer(() => {
  const [markers, setMarkers] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { eventStore } = useStores();

  const map = useMap();

  const clusterer = useMemo(() => {
    if (!map) return null;

    return new MarkerClusterer({ map });
  }, [map]);

  useEffect(() => {
    if (!clusterer) return;

    clusterer.clearMarkers();
    clusterer.addMarkers(Object.values(markers));
  }, [clusterer, markers]);

  const setMarkerRef = useCallback((marker, key) => {
    setMarkers((markers) => {
      if ((marker && markers[key]) || (!marker && !markers[key]))
        return markers;

      if (marker) {
        return { ...markers, [key]: marker };
      } else {
        const { [key]: _, ...newMarkers } = markers;

        return newMarkers;
      }
    });
  }, []);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const onMarkerClick = (event) => {
    map.panTo({ lat: event.latitude, lng: event.longitude });
    fetchEventById(event.eventId)
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
      {eventStore.filteredEvents.map((event) => (
        <EventMarker
          key={event.eventId}
          event={event}
          onClick={onMarkerClick}
          setMarkerRef={setMarkerRef}
        />
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
