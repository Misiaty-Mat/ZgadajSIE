import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import React, { useRef, useState } from "react";
import Select from "react-select";
import LocationStep from "../form-steps/LocationStep";
import DateTimeStep from "../form-steps/DateTimeStep";
import { createEvent } from "../../../../api/events/events";
import { toast } from "react-toastify";
import { useStores } from "../../../../contexts/stores-context";
import { handleError } from "../../../../api/utils";
import useGeolocation from "../../../../hooks/useGeolocation";
import "./AddEventForm-style.css";

const AddEventForm = ({ onReturn }) => {
  const formikRef = useRef(null);

  const [step, setStep] = useState(1);
  const [nextStepDisabled, setNextStepDisabled] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const { eventStore, tagStore } = useStores();
  const { location } = useGeolocation();

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

  const getTagOptions = () => {
    return tagStore.tags.map((tag) => ({
      value: tag.id,
      label: tag.name,
    }));
  };

  const handleTagPicked = (selectedTags) => {
    formikRef.current.setFieldValue(
      "tagIds",
      selectedTags.map((tag) => tag.value)
    );
  };

  const renderSteps = (values, errors, isSubmitting) => {
    switch (step) {
      case 1:
        setNextStepDisabled(values.title === "" || errors.title !== undefined);
        return (
          <div className="loginEmail">
            <label>Jaką ma mieć nazwę?</label>
            <Field className="fieldForm" name="title" />

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
          <div className="addEventModal ">
            <label>Gdzie ma się odbyć?</label>
            <div className="mapInModal">
              <LocationStep />
            </div>
          </div>
        );
      case 3:
        setNextStepDisabled(
          values.startDate === undefined || errors.startDate !== undefined
        );
        return (
          <div className="loginEmail">
            <label>Kiedy ma się odbyć?</label>
            <DateTimeStep />
          </div>
        );
      case 4:
        setNextStepDisabled(errors.maxParticipation);
        return (
          <div>
            <h3>Wybierz liczbę osób chcesz zaprosić</h3>
            <div className="loginEmail">
              <label>Maksimum</label>
              <Field
                className="fieldForm"
                type="number"
                name="maxParticipation"
                min="1"
              />
              <small>
                {errors.maxParticipation
                  ? errors.maxParticipation
                  : "Zostaw puste jeżeli nie chcesz ustawić limitu zaproszonych osób"}
              </small>
            </div>
          </div>
        );
      case 5:
        setNextStepDisabled(false);
        return (
          <div className="loginEmail">
            <label>Dodaj opis do swojego wydarzenia (opcjonalne):</label>
            <Field className="fieldForm" as="textarea" name="description" />
          </div>
        );
      case 6:
        setNextStepDisabled(
          isSubmitting || values.tagIds.length === 0 || errors.tagIds
        );
        setShouldSubmit(true);
        return (
          <div>
            <Select
              className="fieldForm"
              isMulti
              options={getTagOptions()}
              onChange={handleTagPicked}
            />
            <small>{errors.tagIds}</small>
          </div>
        );
      default:
        return undefined;
    }
  };

  const renderForm = ({ values, errors, handleSubmit, isSubmitting }) => (
    <Form onSubmit={handleSubmit}>
      {renderSteps(values, errors, isSubmitting)}
      <button
        className="Modal-logOrRegister-button"
        type="button"
        onClick={step === 1 ? onReturn : prevStep}
      >
        Powrót
      </button>
      <button
        className="Modal-logOrRegister-button"
        type="button"
        disabled={nextStepDisabled}
        onClick={nextStep}
      >
        {shouldSubmit === true ? "Stwórz wydarzenie!" : "Dalej"}
      </button>
    </Form>
  );

  const VALIDATION_SCHEMA = Yup.object({
    title: Yup.string().required("Wydarzenie musi mieć nazwę!"),
    buildingNumber: Yup.string().required(
      "Musisz wybrać miejsce gdzie odbędzie sie twoje wydarzenie!"
    ),
    startDate: Yup.date().required(
      "Musisz wybrać kiedy ma się rozpocząć wydarzenie!"
    ),
    maxParticipation: Yup.number()
      .integer("Musisz podać liczbę całkowitą")
      .nullable(),
    tagIds: Yup.array()
      .of(
        Yup.string().required(
          "Wybierz do 3 oznaczeń, by łatwiej znaleźć twoje wydarzenie!"
        )
      )
      .max(3, "Możesz wybrać do 3 oznaczeń"),
  });

  return (
    <div>
      <Formik
        innerRef={formikRef}
        initialValues={{
          title: "",
          latitude: null,
          longitude: null,
          startDate: "",
          city: "",
          street: "",
          buildingNumber: "",
          maxParticipation: undefined,
          description: "",
          tagIds: [],
        }}
        onSubmit={(values) => {
          createEvent(values)
            .then(() => {
              eventStore.fetchEvents(location);
              toast.success("Twoje wydarzenie zostało utworzone!");
            })
            .catch((error) => {
              handleError(error);
            });
          onReturn();
        }}
        validationSchema={VALIDATION_SCHEMA}
        validateOnChange
        validateOnMount
      >
        {renderForm}
      </Formik>
    </div>
  );
};

export default AddEventForm;
