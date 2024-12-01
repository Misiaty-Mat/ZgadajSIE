import {
  AdvancedMarker,
  APIProvider,
  ControlPosition,
  Map,
  MapControl,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import useGeolocation from "../../hooks/useGeolocation";
import EventMarkers from "./markers/event-markers";
import { useState } from "react";
import MapHandler from "./MapHandler";
import PlaceAutocomplete from "./autocomplete/PlaceAutocomplete";

const EventMap = ({
  width = "100%",
  height = "80vh",
  onSelectLocation,
  onClickMarkerEnabled = false,
}) => {
  const currentLocation = useGeolocation();

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerRef, marker] = useAdvancedMarkerRef();

  const points = [
    {
      id: 1,
      lat: currentLocation.lat - 0.055,
      lng: currentLocation.lng - 0.055,
    },
    { id: 2, lat: currentLocation.lat + 0.02, lng: currentLocation.lng + 0.02 },
  ];

  const onMapClick = (e) => {
    if (onClickMarkerEnabled) {
      const location = e.detail.latLng;
      marker.position = location;
      !!onSelectLocation && onSelectLocation(location);
    }
  };

  return (
    <div style={{ height: height, width: width }}>
      <APIProvider
        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
      >
        <Map
          center={currentLocation}
          zoom={5}
          mapId={process.env.REACT_APP_MAP_ID}
          gestureHandling={"greedy"}
          onClick={onMapClick}
          options={{ disableDefaultUI: true, clickableIcons: false }}
        >
          <AdvancedMarker ref={markerRef} position={null} />
          <EventMarkers points={points} />
        </Map>
        <MapControl position={ControlPosition.TOP}>
          <div className="autocomplete-control">
            <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
          </div>
        </MapControl>
        <MapHandler
          place={selectedPlace}
          marker={onClickMarkerEnabled && marker}
          setLocation={onSelectLocation}
        />
      </APIProvider>
    </div>
  );
};

export default EventMap;
