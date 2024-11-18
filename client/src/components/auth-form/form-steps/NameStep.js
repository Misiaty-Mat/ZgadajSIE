import React from "react";
import { Field } from "formik";

const NameStep = ({ nextStep, prevStep, errors, nextStepDisabled }) => {
  return (
    <>
      <label>Provide your name:</label>
      <Field name="username" />

      {errors && <p>{errors}</p>}

      <button onClick={prevStep}>Back</button>
      <button disabled={nextStepDisabled} onClick={nextStep}>
        Next
      </button>
    </>
  );
};
export default NameStep;
