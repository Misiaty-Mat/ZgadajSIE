import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import LocationStep from "../form-steps/LocationStep";
import DateTimeStep from "../form-steps/DateTimeStep";

const AddEventForm = ({ onSubmitExternal, onReturn }) => {
  const [step, setStep] = useState(1);
  const [nextStepDisabled, setNextStepDisabled] = useState(false);

  const [shouldSubmit, setShouldSubmit] = useState(false);

  const nextStep = (handleSubmit) => {
    if (shouldSubmit) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderSteps = (values, errors) => {
    switch (step) {
      case 1:
        setNextStepDisabled(values.title === "" || errors.title !== undefined);
        return (
          <div>
            <label>Jaką ma mieć nazwę?</label>
            <Field name="title" />

            {errors.title && <p>{errors.title}</p>}
          </div>
        );
      case 2:
        setNextStepDisabled(
          values.locationLat === null || values.locationLng === undefined
        );
        return (
          <div>
            <label>Gdzie ma się odbyć?</label>
            <LocationStep errors={errors.location} />;
          </div>
        );
      case 3:
        setNextStepDisabled(
          values.createAt === null || errors.createAt !== undefined
        );
        return (
          <div>
            <label>Kiedy ma się odbyć?</label>
            <DateTimeStep />
          </div>
        );
      case 4:
        setNextStepDisabled(false);
        setShouldSubmit(true);
        return (
          <div>
            <label>Dodaj opis do swojego wydarzenia (opcjonalne):</label>
            <Field as="textarea" name="description" />
          </div>
        );
      default:
        return undefined;
    }
  };

  const renderForm = ({ values, errors, handleSubmit }) => (
    <Form>
      {renderSteps(values, errors)}
      <button type="button" onClick={step === 1 ? onReturn : prevStep}>
        Powrót
      </button>
      <button
        type="button"
        disabled={nextStepDisabled}
        onClick={() => nextStep(handleSubmit)}
      >
        {shouldSubmit === true ? "Stwórz wydarzenie!" : "Dalej"}
      </button>
    </Form>
  );

  return (
    <div>
      <Formik
        initialValues={{
          title: "",
          locationLat: undefined,
          locationLng: undefined,
          createAt: undefined,
          description: "",
        }}
        onSubmit={(values) => {
          onSubmitExternal();
          alert(JSON.stringify(values));
        }}
        validationSchema={Yup.object({
          title: Yup.string().required("Wydarzenie musi mieć nazwę!"),
          createAt: Yup.date().required(),
        })}
        validateOnChange
        validateOnMount
      >
        {renderForm}
      </Formik>
    </div>
  );
};

export default AddEventForm;
