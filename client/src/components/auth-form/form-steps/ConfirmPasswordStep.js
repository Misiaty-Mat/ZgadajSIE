import { Field } from "formik";
import React from "react";

const ConfirmPasswordStep = ({ prevStep, errors, submitDisabled }) => {
  return (
    <>
      <label>Confirm your password</label>
      <Field name="confirmPassword" type="password" />

      {errors && <p>{errors}</p>}

      <button onClick={prevStep}>Back</button>
      <button type="submit" disabled={submitDisabled}>
        Submit
      </button>
    </>
  );
};

export default ConfirmPasswordStep;
