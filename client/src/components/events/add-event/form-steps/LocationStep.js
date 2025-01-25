import React from "react";
import { useFormikContext } from "formik";
import EventMap from "../../../map/EventMap";
import "./LocationStep-style.css";

const LocationStep = () => {
  const formik = useFormikContext();

  const onMapClicked = async (location) => {
    await formik.setFieldValue("latitude", location.lat);
    await formik.setFieldValue("longitude", location.lng);
  };

  const getAddress = () => {
    const { city, street, buildingNumber } = formik.values;

    if (city && street && buildingNumber) {
      return `${city} ul. ${street} ${buildingNumber}`;
    }
  };

  return (
    <div className="">
      <h1>{getAddress()}</h1>
      <EventMap onSelectLocation={onMapClicked} onClickMarkerEnabled={true} />
    </div>
  );
};
export default LocationStep;
