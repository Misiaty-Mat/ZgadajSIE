import React from "react";
import { Field, useFormikContext } from "formik";
import EventMap from "../../../map/EventMap";

const LocationStep = ({ nextStep, prevStep, errors, nextStepDisabled }) => {
  const formikProps = useFormikContext();

  const onMapClicked = (location) => {
    formikProps.setFieldValue("locationLat", location.lat);
    formikProps.setFieldValue("locationLng", location.lng);
  };

  return (
    <>
      <label>Select your event location form the map:</label>

      <EventMap
        height="40vh"
        onSelectLocation={onMapClicked}
        onClickMarkerEnabled={true}
      />

      <Field name="location" value={{}} hidden />
      {errors && <p>{errors}</p>}

      <button type="button" onClick={prevStep}>
        Back
      </button>
      <button type="submit" disabled={nextStepDisabled} onClick={nextStep}>
        Next
      </button>
    </>
  );
};
export default LocationStep;
