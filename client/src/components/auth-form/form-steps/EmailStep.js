import React from "react";
import { Field } from "formik";

const EmailStep = ({ nextStep, prevStep, errors, nextStepDisabled }) => {
  return (
    <>
      <label>Provide your email:</label>
      <Field name="email" />

      {errors && <p>{errors}</p>}

      <button onClick={prevStep}>Back</button>
      <button disabled={nextStepDisabled} onClick={nextStep}>
        Next
      </button>
    </>
  );
};
export default EmailStep;
