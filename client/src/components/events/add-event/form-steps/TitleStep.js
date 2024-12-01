import React from "react";
import {Field} from "formik";

const TitleStep = ({nextStep, prevStep, errors, nextStepDisabled}) => {
    return (
        <>
            <label>Title of your event:</label>
            <Field name="title"/>

            {errors && <p>{errors}</p>}

            <button type="button" onClick={prevStep}>Back</button>
            <button disabled={nextStepDisabled} onClick={nextStep}>
                Next
            </button>
        </>
    );
};
export default TitleStep;
