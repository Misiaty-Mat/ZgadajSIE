import React from "react";
import { useFormikContext } from "formik";
import EventMap from "../../../map/EventMap";

const LocationStep = () => {
  const formik = useFormikContext();

  const onMapClicked = async (location) => {
    await formik.setFieldValue("latitude", `${location.lat}`);
    await formik.setFieldValue("longitude", `${location.lng}`);
  };

  const getAddress = () => {
    const { city, street, buildingNumber } = formik.values;

    if (city && street && buildingNumber) {
      return `${city} ul. ${street} ${buildingNumber}`;
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
