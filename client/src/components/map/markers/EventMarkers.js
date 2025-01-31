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

  // jeżeli zmieni się stan markers -- wyczyść poprzednie klastry i dodaj nowe
  useEffect(() => {
    if (!clusterer) return;

    clusterer.clearMarkers();
    clusterer.addMarkers(Object.values(markers));
  }, [clusterer, markers]);

  // ustawienie odniesienia każdego znacznika do stanu markers
  const setMarkerRef = useCallback((marker, key) => {
    setMarkers((markers) => {
      // jeżeli znacznik istnieje i jest w liście lub znacznik nie istnieje i nie ma go w liście znaczników -- nie zmieniaj stanu
      if ((marker && markers[key]) || (!marker && !markers[key]))
        return markers;

      // jeżeli znacznik jest na mapie -- dodaj go do do stanu
      // jeżeli znacznik nie jest na mapie -- usuń go z stanu
      if (marker) {
        return { ...markers, [key]: marker };
      } else {
        const { [key]: _, ...newMarkers } = markers;

        return newMarkers;
      }
    });
  }, []);

  // po kliknięciu w znacznik wyśrodkuj go na mapie i ustaw wybrane wydarzenie w globalnym stane
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
