import {
  AdvancedMarker,
  APIProvider,
  ControlPosition,
  Map,
  MapControl,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { setDefaults, fromLatLng } from "react-geocode";
import { toast } from "react-toastify";
import "./event-map.css";

import useGeolocation from "../../hooks/useGeolocation";
import EventMarkers from "./markers/EventMarkers";
import { useState } from "react";
import MapHandler from "./MapHandler";
import PlaceAutocomplete from "./autocomplete/PlaceAutocomplete";
import { useFormikContext } from "formik";

const EventMap = ({ onSelectLocation, onClickMarkerEnabled = false }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerRef, marker] = useAdvancedMarkerRef();

  const { location } = useGeolocation();

  const formik = useFormikContext();

  setDefaults({
    key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    language: "pl",
    region: "pl",
  });

  const getAddress = ({ lat, lng }) => {
    return fromLatLng(lat, lng).then(({ results }) => {
      const addressComponents = results[0].address_components;

      const city = addressComponents.find((component) =>
        component.types.includes("locality")
      )?.long_name;

      const street = addressComponents.find((component) =>
        component.types.includes("route")
      )?.long_name;

      const buildingNumber = addressComponents.find((component) =>
        component.types.includes("street_number")
      )?.long_name;

      if ([city, street, buildingNumber].some((val) => !val)) {
        return "";
      } else {
        return { city, street, buildingNumber };
      }
    });
  };

  const onMapClick = (e) => {
    if (onClickMarkerEnabled) {
      const location = e.detail.latLng;
      getAddress(location).then(async (address) => {
        if (address) {
          const { city, street, buildingNumber } = address;
          await formik.setFieldValue("city", city);
          await formik.setFieldValue("street", street);
          await formik.setFieldValue("buildingNumber", buildingNumber);
          marker.position = location;
          !!onSelectLocation && (await onSelectLocation(location));
        } else {
          toast.warning("Wybierz lokalizację, która zawiera poprawny adres!");
        }
      });
    }
  };

  return (
    <div className="main-page-sectionRight-map">
      <APIProvider
        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
        libraries={["geometry", "places"]}
      >
        <Map
          id={process.env.REACT_APP_MAP_ID}
          center={{ lat: location.latitude, lng: location.longitude }}
          zoom={5}
          mapId={process.env.REACT_APP_MAP_ID}
          gestureHandling={"greedy"}
          onClick={onMapClick}
          options={{ disableDefaultUI: true, clickableIcons: false }}
        >
          <AdvancedMarker ref={markerRef} position={null} />
          <EventMarkers />
          {!onClickMarkerEnabled && (
            <MapControl position={ControlPosition.TOP}>
              <div className="autocomplete-control">
                <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
              </div>
            </MapControl>
          )}
          <MapHandler
            place={selectedPlace}
            marker={onClickMarkerEnabled && marker}
            setLocation={onSelectLocation}
          />
        </Map>
      </APIProvider>
    </div>
  );
};

export default EventMap;
