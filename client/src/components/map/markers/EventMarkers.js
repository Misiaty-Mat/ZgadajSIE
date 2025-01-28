import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import EventMarker from "./EventMarker";
import { useStores } from "../../../contexts/stores-context";

const EventMarkers = observer(({ onMarkerClickEnabled }) => {
  const [markers, setMarkers] = useState({});

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

  const onMarkerClick = (event) => {
    if (onMarkerClickEnabled) {
      map.panTo({ lat: event.latitude, lng: event.longitude });
      eventStore.setSelectedEvent(event.eventId);
    }
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
    </>
  );
});

export default EventMarkers;
