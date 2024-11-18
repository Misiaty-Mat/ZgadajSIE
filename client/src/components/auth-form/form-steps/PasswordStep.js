import {Field} from "formik";
import React from "react";

const PasswordStep = ({nextStep, prevStep, submitVisable, submitDisabled, nextStepDisabled, errors}) => {
    return (
        <>
            <label>Provide your password</label>
            <Field name="password" type="password"/>

            {errors && <p>{errors}</p>}

            <button onClick={prevStep}>Back</button>
            {nextStep && <button disabled={nextStepDisabled} onClick={nextStep}>Next</button>}
            {submitVisable && (
                <button type="submit" disabled={submitDisabled}>
                    Submit
                </button>
            )}
        </>
    );
};

export default PasswordStep;
