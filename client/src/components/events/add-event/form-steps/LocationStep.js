import React from "react";
import { useFormikContext } from "formik";
import EventMap from "../../../map/EventMap";

const LocationStep = () => {
  const formik = useFormikContext();

  const onMapClicked = (location) => {
    formik.setFieldValue("locationLat", location.lat);
    formik.setFieldValue("locationLng", location.lng);
  };

  return (
    <EventMap
      height="40vh"
      onSelectLocation={onMapClicked}
      onClickMarkerEnabled={true}
    />
  );
};
export default LocationStep;
