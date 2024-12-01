import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

const MapHandler = ({ place, marker, setLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place) return;

    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
    }

    if (marker) {
      const location = place.geometry?.location;
      marker.position = location;
      setLocation({ lat: location.lat(), lng: location.lng() });
    }
  }, [map, place, marker, setLocation]);
  return null;
};

export default MapHandler;
