import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import React, { useRef, useState } from "react";
import LocationStep from "../form-steps/LocationStep";
import DateTimeStep from "../form-steps/DateTimeStep";
import { createEvent } from "../../../../api/events/events";
import { toast } from "react-toastify";
import { useStores } from "../../../../contexts/event-context";

const AddEventForm = ({ onReturn }) => {
  const formikRef = useRef(null);

  const [step, setStep] = useState(1);
  const [nextStepDisabled, setNextStepDisabled] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const { eventStore } = useStores();

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
        const { latitude, longitude, city, street, buildingNumber } = values;
        setNextStepDisabled(
          [latitude, longitude, city, street, buildingNumber].some(
            (val) => !val
          )
        );
        return (
          <div>
            <label>Gdzie ma się odbyć?</label>
            <LocationStep />;
          </div>
        );
      case 3:
        setNextStepDisabled(
          values.startDate === undefined || errors.startDate !== undefined
        );
        return (
          <div>
            <label>Kiedy ma się odbyć?</label>
            <DateTimeStep />
          </div>
        );
      case 4:
        setNextStepDisabled(errors.maxAttendance);
        return (
          <div>
            <h3>Wybierz liczbę osób chcesz zaprosić</h3>
            <div>
              <label>Maksimum</label>
              <Field type="number" name="maxAttendance" min="1" />
              <small>
                {errors.maxAttendance
                  ? errors.maxAttendance
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
          latitude: null,
          longitude: "",
          startDate: "",
          city: "",
          street: "",
          buildingNumber: "",
          maxAttendance: undefined,
          description: "",
        }}
        onSubmit={(values) => {
          createEvent(values)
            .then(() => {
              eventStore.updateMapPins();
              toast.success("Twoje wydarzenie zostało utworzone!");
            })
            .catch((error) => {
              if (error.status === 400) {
                Object.values(error.response.data.errors)
                  .flatMap((arr) => arr)
                  .forEach((errorMsg) => {
                    toast.error(errorMsg);
                  });
              } else {
                toast.error("Coś poszło nie tak... " + error.message);
              }
            });
          onReturn();
        }}
        validationSchema={Yup.object({
          title: Yup.string().required("Wydarzenie musi mieć nazwę!"),
          buildingNumber: Yup.string().required(
            "Musisz wybrać miejsce gdzie odbędzie sie twoje wydarzenie!"
          ),
          startDate: Yup.date().required(
            "Musisz wybrać kiedy ma się rozpocząć wydarzenie!"
          ),
          maxAttendance: Yup.number()
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
