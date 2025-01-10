import React from "react";
import { useFormikContext } from "formik";
import EventMap from "../../../map/EventMap";

const LocationStep = () => {
  const formik = useFormikContext();

  const onMapClicked = async (location) => {
    await formik.setFieldValue("lat", location.lat);
    await formik.setFieldValue("lng", location.lng);
  };

  const getAddress = () => {
    const { city, street, building } = formik.values;

    if (city && street && building) {
      return `${city} ul. ${street} ${building}`;
    }
  };

  return (
    <div>
      <h1>{getAddress()}</h1>
      <EventMap
        height="40vh"
        onSelectLocation={onMapClicked}
        onClickMarkerEnabled={true}
      />
    </div>
  );
};
export default LocationStep;
