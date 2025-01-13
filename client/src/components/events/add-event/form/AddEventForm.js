import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import React, { useRef, useState } from "react";
import LocationStep from "../form-steps/LocationStep";
import DateTimeStep from "../form-steps/DateTimeStep";

const AddEventForm = ({ onReturn }) => {
  const formikRef = useRef(null);

  const [step, setStep] = useState(1);
  const [nextStepDisabled, setNextStepDisabled] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const nextStep = async () => {
    if (shouldSubmit && formikRef.current) {
      await formikRef.current?.submitForm();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setShouldSubmit(false);
    setStep((prev) => prev - 1);
  };

  const renderSteps = (values, errors, isSubmitting) => {
    switch (step) {
      case 1:
        setNextStepDisabled(values.title === "" || errors.title !== undefined);
        return (
          <div>
            <label>Jaką ma mieć nazwę?</label>
            <Field name="title" />

            {errors.title && <small>{errors.title}</small>}
          </div>
        );
      case 2:
        const { lat, lng, city, street, building } = values;
        setNextStepDisabled(
          [lat, lng, city, street, building].some((val) => !val)
        );
        return (
          <div>
            <label>Gdzie ma się odbyć?</label>
            <LocationStep />;
          </div>
        );
      case 3:
        setNextStepDisabled(
          values.beginAt === undefined || errors.beginAt !== undefined
        );
        return (
          <div>
            <label>Kiedy ma się odbyć?</label>
            <DateTimeStep />
          </div>
        );
      case 4:
        setNextStepDisabled(errors.minInvites || errors.maxInvites);
        return (
          <div>
            <h3>Wybierz liczbę osób chcesz zaprosić</h3>
            <div>
              <label>Minimum</label>
              <Field
                type="number"
                name="minInvites"
                min="1"
                step="1"
                max={formikRef.current.values.maxInvites}
              />
              {errors.minInvites && <small>{errors.minInvites}</small>}
            </div>
            <div>
              <label>Maksimum</label>
              <Field
                type="number"
                name="maxInvites"
                min={formikRef.current.values.minInvites}
              />
              <small>
                {errors.maxInvites
                  ? errors.maxInvites
                  : "Zostaw puste jeżeli nie chcesz ustawić limitu zaproszonych osób"}
              </small>
            </div>
          </div>
        );
      case 5:
        setNextStepDisabled(isSubmitting);
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

  const renderForm = ({ values, errors, handleSubmit, isSubmitting }) => (
    <Form onSubmit={handleSubmit}>
      {renderSteps(values, errors, isSubmitting)}
      <button type="button" onClick={step === 1 ? onReturn : prevStep}>
        Powrót
      </button>
      <button type="button" disabled={nextStepDisabled} onClick={nextStep}>
        {shouldSubmit === true ? "Stwórz wydarzenie!" : "Dalej"}
      </button>
    </Form>
  );

  return (
    <div>
      <Formik
        innerRef={formikRef}
        initialValues={{
          title: "",
          lat: null,
          lng: null,
          beginAt: null,
          city: "",
          street: "",
          building: "",
          minInvites: 1,
          maxInvites: undefined,
          description: "",
        }}
        onSubmit={(values) => {
          onReturn();
          alert(JSON.stringify(values));
        }}
        validate={(values) => {
          if (
            values.minInvites &&
            values.maxInvites &&
            Number(values.minInvites) > Number(values.maxInvites)
          ) {
            return { maxInvites: "Maksimum nie może być mniejsze od minimum" };
          }
          return {};
        }}
        validationSchema={Yup.object({
          title: Yup.string().required("Wydarzenie musi mieć nazwę!"),
          building: Yup.string().required(
            "Musisz wybrać miejsce gdzie odbędzie sie twoje wydarzenie!"
          ),
          beginAt: Yup.date().required(
            "Musisz wybrać kiedy ma się rozpocząć wydarzenie!"
          ),
          minInvites: Yup.number()
            .integer("Musisz podać liczbę całkowitą")
            .min(1, "Zaproś przynajmniej 1 osobę")
            .required("Musisz zaprosić przynajmniej 1 osobę"),
          maxInvites: Yup.number()
            .integer("Musisz podać liczbę całkowitą")
            .nullable(),
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
