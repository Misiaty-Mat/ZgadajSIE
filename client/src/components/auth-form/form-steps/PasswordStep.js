import { Field } from "formik";
import React from "react";

const PasswordStep = ({
  nextStep,
  prevStep,
  submitVisable,
  submitDisabled,
  errors,
}) => {
  return (
    <>
      <label>Provide your password</label>
      <Field name="password" type="password" />

      {errors && <p>{errors}</p>}

      <button onClick={prevStep}>Back</button>
      {nextStep && <button onClick={nextStep}>Next</button>}
      {submitVisable && (
        <button type="submit" disabled={submitDisabled}>
          Submit
        </button>
      )}
    </>
  );
};

export default PasswordStep;
